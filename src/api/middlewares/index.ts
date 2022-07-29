import path from 'path'
import { client } from 'utils/services/redis/init'
import { createWriteStream } from 'fs'
import { json as bodyParserJSON } from 'body-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import responseTime from 'response-time'
import rateLimit from 'express-rate-limit'

import { IMiddlewareOptions } from './interfaces/IMiddlewareOptions'
import { filesRouter } from 'routes/files'
import { projectsRouter } from 'routes/projects'
import { emailRouter } from 'routes/email'

async function setupMiddlewares(app, options: IMiddlewareOptions) {
    const limiter = rateLimit({
        windowMs: options.rateLimit.windowMs,
        max: (request) => {
            const path = request.originalUrl;
            if (path.includes("email")) return 20;
            else return 15;
        },
        standardHeaders: true,
        legacyHeaders: false,
        skip: async (request) => {
            const path = request.originalUrl;
            if (path.includes("files")) {
                return await client.exists("files") === 1;
            }
            if (path.includes("projects")) {
                return await client.exists("projects") === 1;
            }
            return false;
        }
    });
    app.use(limiter);
    app.use(helmet({
        contentSecurityPolicy: false
    }));
    app.use(bodyParserJSON());
    app.use(responseTime());
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", options.CORS.origin);
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
        return next();
    });
    app.use(`${process.env.API_PREFIX}/files`, filesRouter);
    app.use(`${process.env.API_PREFIX}/projects`, projectsRouter);
    app.use(`${process.env.API_PREFIX}/email`, emailRouter);
    app.use(
        morgan("combined", {
            stream: createWriteStream(
                path.join(process.cwd(), "/logs/morgan.combined.log"),
                {
                    flags: "a",
                }
            ),
            skip: function (req) {
                if (req.url === '/') return true;
                return false;
            }
        })
    );
}

export { setupMiddlewares }