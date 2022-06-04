import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import express from 'express'
import { check, validationResult } from 'express-validator'
import helmet from 'helmet'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import fetch from 'node-fetch'

import { getFiles } from './s3/getFilesFromBucket.js'
import { modelFiles } from './s3/utils/modelFiles.js'

import errorFormatter from './utils/errorFormatter.js'
import { sendEmail } from './ses/sendEmail.js'

import { customLogReport } from './utils/customLogReport.js'
import { getProjects } from './dynamodb/getProjects.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SERVER_ENVIRONMENT = process.env.SERVER_ENVIRONMENT
const SERVER_PORT = process.env.SERVER_PORT || 3000
const APP_URL = process.env.APP_URL || '*'

const app = express()
app.use(bodyParser.json())
app.use(helmet())

if (SERVER_ENVIRONMENT == 'development') {
    app.use(
        morgan('dev', {
            stream: fs.createWriteStream(
                path.join(__dirname, '/logs/access.dev.log'),
                {
                    flags: 'a',
                }
            ),
        })
    )
}
if (SERVER_ENVIRONMENT == 'production') {
    app.use(
        morgan('combined', {
            stream: fs.createWriteStream(
                path.join(__dirname, '/logs/access.log'),
                {
                    flags: 'a',
                }
            ),
        })
    )
}
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', APP_URL)
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.get('/api/files', async (req, res) => {
    try {
        let files = (await getFiles()).Contents
        files = await modelFiles(files)
        return res.status(200).json({ success: true, data: files })
    } catch (error) {
        customLogReport(
            path.join(__dirname),
            'files',
            `Error encountered while trying to get files. Error message: "${error}" \n`
        )
        return res.status(500).json({
            success: false,
            message:
                'Service is temporarily unavailable, please try again later.',
        })
    }
})

app.get('/api/projects', async (req, res) => {
    try {
        let projects = await getProjects()
        return res.status(200).json({ success: true, data: projects })
    } catch (error) {
        customLogReport(
            path.join(__dirname),
            'projects',
            `Error encountered while trying to get projects. Error message: "${error}" \n`
        )
        return res.status(500).json({
            success: false,
            message: 'Service is temporarily unavailable, please try again later.'
        })
    }
})

app.post(
    '/api/sendEmail',
    [
        check('secret').not().isEmpty(),
        check('token').not().isEmpty(),
        check('message').isLength({ min: 15 }).trim().escape(),
        check('email').isEmail().normalizeEmail(),
        check('name').isLength({ min: 3 }).trim().escape(),
    ],
    async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name, email, message, secret, token } = req.body
        const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
        const verify = await fetch(VERIFY_URL, {
            method: 'POST',
            body: `secret=${secret}&response=${token}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        const verification = await verify.json()
        if (verification.success) {
            try {
                let { MessageId } = await sendEmail(name, email, message)
                return res.status(200).json({
                    success: true,
                    messageId: MessageId,
                    message:
                        'Your message has been sent succesfully. Keep in touch!',
                })
            } catch (error) {
                customLogReport(
                    path.join(__dirname),
                    'sendEmail',
                    `Error encountered while trying to send email. Error message: "${error}" \n`
                )
                return res.status(500).json({
                    success: false,
                    message:
                        'Service is temporary unavailable, please try again later.',
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please retry reCAPTCHA challenge.',
            })
        }
    }
)

app.listen(SERVER_PORT, () =>
    console.log(`API listening on port ${SERVER_PORT} \n`)
)
