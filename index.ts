import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import * as express from 'express'
import * as bodyParser from 'body-parser'

import helmet from 'helmet'
import * as morgan from 'morgan'
import * as responseTime from 'response-time'

import { initializeRedis } from './utils/libs/redis/init'

import { filesRouter } from './src/api/routes/files'
import { projectsRouter } from './src/api/routes/projects'
import { emailRouter } from './src/api/routes/mail'

const SERVER_PORT = process.env.SERVER_PORT;
const APP_URL = process.env.APP_URL;
if (APP_URL == null) {
    throw new Error('APP_URL environment variable is not set and is required in order to run the backend.')
}

try {
    initializeRedis();
} catch (error) {
    throw new Error(error as string);
}

const app = express()
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", APP_URL)
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
    if (req.method === "OPTIONS") {
        return res.sendStatus(200)
    }
    return next()
})
app.use(bodyParser.json())
app.use(helmet({
    contentSecurityPolicy: false
}))
app.use(responseTime())
app.use(
    morgan("tiny", {
        stream: fs.createWriteStream(
            path.join(__dirname, "/logs/access.log"),
            {
                flags: "a",
            }
        ),
    })
)
app.use(`${process.env.API_PREFIX}/files`, filesRouter);
app.use(`${process.env.API_PREFIX}/projects`, projectsRouter);
app.use(`${process.env.API_PREFIX}/email`, emailRouter);

app.listen(SERVER_PORT, () =>
    console.log(`API listening on port ${SERVER_PORT} \n`)
)
