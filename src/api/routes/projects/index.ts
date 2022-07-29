import * as express from 'express';

// redis utils
import { client } from 'utils/services/redis/init';
import { config } from 'utils/services/redis/config';

// dynamodb utils
import { getProjects } from 'utils/services/dynamodb/getProjects';

// logging
import { LoggingOf } from 'utils/logging/enum/LoggingOf';
import { RouteLogger } from 'utils/logging/routes/RouteLogger';
import { generateHttpOptions } from 'utils/logging/routes/functions/generateHttpOptions';
import { Services } from 'utils/logging/enum/Services';

const router = express.Router()
router.get('/', async (req, res) => {
    const areProjectsInCache = await client.exists("projects") === 1;
    const logOptions = {
        http: generateHttpOptions(req)
    };
    if (!areProjectsInCache) {
        try {
            const projects = await getProjects();
            const log: RouteLogger = new RouteLogger("projects");
            if (projects) {
                log.setMessage(`Succesfully retrieved projects from DynamoDB via AWS SDK.`);

                log.setService(Services.DynamoDB);
                log.setLoggingOf(LoggingOf.access);
                log.append(log.getLogDir(), logOptions);
                await client.setEx("projects", config.projects_api_response_cache_period, JSON.stringify(projects));

                return res.status(200).json({ success: true, data: projects });
            }
        } catch (error) {
            const log: RouteLogger = new RouteLogger("projects");
            log.setMessage(`Error encountered while trying to get projects. Error message: "${error}"`);
            log.setLoggingOf(LoggingOf.error);
            log.setService(Services.DynamoDB);
            log.append(log.getLogDir(), logOptions);

            return res.status(500).json({
                success: false,
                message: "Service is temporarily unavailable, please try again later."
            });
        }
    }
    try {
        const cachedProjects = await client.get("projects");
        let log: RouteLogger = new RouteLogger("projects");
        log.setMessage(`[GET] Client is requesting projects...`);
        log.setService(Services.redis);
        log.setLoggingOf(LoggingOf.access);
        log.append(log.getLogDir(), logOptions);

        log = new RouteLogger("projects");
        log.setMessage(`[GET] Succesfully retrieved projects from Redis...`);
        log.setService(Services.redis);
        log.setLoggingOf(LoggingOf.access);
        log.append(log.getLogDir(), logOptions);

        return res.status(200).json({ success: true, data: JSON.parse(cachedProjects as string) });
    } catch (error) {
        const log: RouteLogger = new RouteLogger("projects");
        log.setMessage(`Error encountered while trying to get projects from Redis. Error message: "${error}"`);
        log.setService(Services.redis);
        log.setLoggingOf(LoggingOf.error);
        log.append(log.getLogDir(), logOptions);
        return res.status(500).json({
            success: false,
            message:
                "Service is temporarily unavailable, please try again later.",
        });
    }
})

export { router as projectsRouter }