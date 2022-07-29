import 'dotenv/config'
import express from 'express'

import { IMiddlewareOptions } from 'api/middlewares/interfaces/IMiddlewareOptions'
import { setupMiddlewares } from 'api/middlewares'

import { initializeRedis } from 'utils/services/redis/init'
import { ArchiveAndClearLogsOnceADay } from 'utils/cronjobs/logs'
import { getCurrentTime } from 'utils/date/getCurrentTime'


const API_RATE_LIMITER_WINDOW_TIME: number = parseInt(process.env.API_RATE_LIMITER_WINDOW_TIME as string);
const APP_URL: string = process.env.APP_URL as string;
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT as string);
if (APP_URL == null) {
    throw new Error('APP_URL environment variable is not set and is required in order to set the Access-Control-Allow-Origin middleware response headers.');
}
const app = express();
app.get('/', (_, res) => {
    res.status(200).send();
});
app.listen(SERVER_PORT, () =>
    console.log(`[${getCurrentTime()}] API listening on port ${SERVER_PORT} \n`)
);

setImmediate(() => {
    const middlewareOptions: IMiddlewareOptions = {
        rateLimit: {
            windowMs: API_RATE_LIMITER_WINDOW_TIME
        },
        CORS: {
            origin: APP_URL
        }
    };
    setupMiddlewares(app, middlewareOptions)
});
setImmediate(() => {
    initializeRedis();
});
setImmediate(() => ArchiveAndClearLogsOnceADay());
