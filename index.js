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
import responseTime from 'response-time'

// redis utils
import { client, initializeRedis } from './utils/libs/redis/init.js'
import { config } from './utils/libs/redis/config.js'

// s3 utils
import { getFiles } from './utils/libs/s3/getFilesFromBucket.js'
import { modelFiles } from './utils/libs/s3/utils/modelFiles.js'

// dynamodb utils
import { getProjects } from './utils/libs/dynamodb/getProjects.js'

// ses utils
import { sendEmail } from './utils/libs/ses/sendEmail.js'

// log reports && error formatter
import { customLogReport } from './utils/customLogReport.js'
import errorFormatter from './utils/errorFormatter.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SERVER_ENVIRONMENT = process.env.SERVER_ENVIRONMENT || "development";
const SERVER_PORT = process.env.SERVER_PORT || 3000
const APP_URL = SERVER_ENVIRONMENT === "development" && "*" || process.env.APP_URL;

if (SERVER_ENVIRONMENT === "production" && APP_URL == null) {
    throw new Error('APP_URL environment variable is not set and is required in production environment.')
}

try {
    initializeRedis();
} catch (error) {
    throw new Error(error);
}

const app = express()
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", APP_URL)
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    if (req.method === "OPTIONS") {
        return res.sendStatus(200)
    }
    next()
})
app.use(bodyParser.json())
app.use(helmet({
    contentSecurityPolicy: false
}))
app.use(responseTime())

if (SERVER_ENVIRONMENT == "development") {
    app.use(
        morgan("dev", {
            stream: fs.createWriteStream(
                path.join(__dirname, "/logs/access.dev.log"),
                {
                    flags: "a",
                }
            ),
        })
    )
}
if (SERVER_ENVIRONMENT == "production") {
    app.use(
        morgan("combined", {
            stream: fs.createWriteStream(
                path.join(__dirname, "/logs/access.log"),
                {
                    flags: "a",
                }
            ),
        })
    )
}

app.get("/api/files", async (req, res) => {
    try {
        const cachedFiles = await client.get("files");
        if (cachedFiles) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedFiles) });
        }
    } catch (error) {
        customLogReport(
            path.join(__dirname),
            "redis.files",
            `Error encountered while trying to get files from Redis. Error message: "${error}" \n`
        )
        return res.status(500).json({
            success: false,
            message:
                "Service is temporarily unavailable, please try again later.",
        })
    }
    try {
        let files = (await getFiles()).Contents
        files = await modelFiles(files)
        await client.setEx("files", config.files_api_response_cache_period, JSON.stringify(files));
        return res.status(200).json({ success: true, data: files })
    } catch (error) {
        customLogReport(
            path.join(__dirname),
            "files",
            `Error encountered while trying to get files. Error message: "${error}" \n`
        )
        return res.status(500).json({
            success: false,
            message:
                "Service is temporarily unavailable, please try again later.",
        })
    }
})
app.get("/api/projects", async (req, res) => {
    try {
        const cachedProjects = await client.get("projects");
        if (cachedProjects) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedProjects) });
        }
    } catch (error) {
        customLogReport(
            path.join(__dirname),
            "redis",
            `Error encountered while trying to get files from Redis client. Error message: "${error}" \n`
        )
        return res.status(500).json({
            success: false,
            message:
                "Service is temporarily unavailable, please try again later.",
        })
    }
    try {
        let projects = await getProjects()
        await client.setEx("projects", config.projects_api_response_cache_period, JSON.stringify(projects));
        return res.status(200).json({ success: true, data: projects })
    } catch (error) {
        customLogReport(
            path.join(__dirname),
            "projects",
            `Error encountered while trying to get projects. Error message: "${error}" \n`
        )
        return res.status(500).json({
            success: false,
            message: "Service is temporarily unavailable, please try again later."
        })
    }
})

app.post(
    "/api/sendEmail",
    [
        check("secret").not().isEmpty(),
        check("token").not().isEmpty(),
        check("message").isLength({ min: 15 }).trim().escape(),
        check("email").isEmail().normalizeEmail(),
        check("name").isLength({ min: 3 }).trim().escape(),
    ],
    async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name, email, message, secret, token } = req.body
        const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"
        const verify = await fetch(VERIFY_URL, {
            method: "POST",
            body: `secret=${secret}&response=${token}`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        const verification = await verify.json()
        if (verification.success) {
            try {
                let { MessageId } = await sendEmail(name, email, message)
                return res.status(200).json({
                    success: true,
                    messageId: MessageId,
                    message:
                        "Your message has been sent succesfully. Keep in touch!",
                })
            } catch (error) {
                customLogReport(
                    path.join(__dirname),
                    "sendEmail",
                    `Error encountered while trying to send email. Error message: "${error}" \n`
                )
                return res.status(500).json({
                    success: false,
                    message:
                        "Service is temporary unavailable, please try again later.",
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Please retry reCAPTCHA challenge.",
            })
        }
    }
)

app.listen(SERVER_PORT, () =>
    console.log(`API listening on port ${SERVER_PORT} \n`)
)
