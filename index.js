import 'dotenv/config'
import express from 'express'

import { getFiles } from './s3/getFilesFromBucket.js'
import { modelFiles } from './s3/utils/modelFiles.js'

import { check, validationResult } from 'express-validator'
import errorFormatter from './ses/utils/errorFormatter.js'
import { sendEmail } from './ses/sendEmail.js'

import { log } from './dev/performanceLogger.js'

const app = express()
const port = 3000
app.use(express.json())

if (process.env.APP_ENV === 'development') {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
}
if (process.env.APP_ENV === 'production') {
    app.use(express.errorHandler())
}
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.get('/files', async (req, res) => {
    try {
        if (process.env.APP_ENV == 'DEVELOPMENT') {
            log(req, 'initial PoE')
        }
        let files = (await getFiles()).Contents
        if (process.env.APP_ENV == 'DEVELOPMENT') {
            log(files, 'populating files coming from AWS API')
        }
        files = await modelFiles(files)
        if (process.env.APP_ENV == 'DEVELOPMENT') {
            log(files, 'final PoE')
        }
        return res.status(200).json({ success: true, files: files })
    } catch (error) {
        console.log(
            `Error encountered while trying to get files. \n Error message: ${error} \n`
        )
        return res.status(500).json({
            success: false,
            message:
                'Service is temporarily unavailable, please try again later.',
        })
    }
})

app.post(
    '/sendEmail',
    [
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
        const { name, email, message } = req.body
        try {
            let { MessageId } = await sendEmail(name, email, message)
            return res.status(200).json({
                success: true,
                messageId: MessageId,
                message:
                    'Your message has been sent succesfully. Keep in touch!',
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    'Service is temporary unavailable, please try again later.',
            })
        }
    }
)

app.listen(port, () => console.log(`API listening on port ${port} \n`))
