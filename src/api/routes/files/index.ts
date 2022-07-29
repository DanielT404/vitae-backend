import express from 'express';

// redis utils
import { client } from 'utils/services/redis/init';
import { config } from 'utils/services/redis/config';

// s3 utils
import { getFiles } from 'utils/services/s3/getFilesFromBucket';
import { modelFiles } from 'utils/services/s3/utils/modelFiles';

// logging
import { LoggingOf } from 'utils/logging/enum/LoggingOf';
import { RouteLogger } from 'utils/logging/routes/RouteLogger';
import { generateHttpOptions } from 'utils/logging/routes/functions/generateHttpOptions';
import { Services } from 'utils/logging/enum/Services';

const router = express.Router()
router.get('/', async (req, res) => {
    const areFilesInCache = await client.exists("files") === 1;
    const logOptions = {
        http: generateHttpOptions(req)
    };
    if (!areFilesInCache) {
        try {
            let files = (await getFiles()).Contents;
            files = await modelFiles(files);

            const log: RouteLogger = new RouteLogger("files");
            log.setMessage(`Succesfully retrieved files from S3 via AWS SDK.`);
            log.setService(Services.S3);
            log.setLoggingOf(LoggingOf.access);
            log.append(log.getLogDir(), logOptions);

            await client.setEx("files", config.files_api_response_cache_period, JSON.stringify(files));
            return res.status(200).json({ success: true, data: files });
        } catch (error) {
            const log: RouteLogger = new RouteLogger("files");
            log.setMessage(`Error encountered while trying to get files from S3. Error message: "${error}"`);
            log.setService(Services.S3);
            log.setLoggingOf(LoggingOf.error);
            log.append(log.getLogDir(), logOptions);
            return res.status(500).json({
                success: false,
                message:
                    "Service is temporarily unavailable, please try again later.",
            });
        }
    }
    try {
        const cachedFiles = await client.get("files");

        const log: RouteLogger = new RouteLogger("files");
        log.setMessage(`[GET cmd] Client is requesting files...`);
        log.setService(Services.redis);
        log.setLoggingOf(LoggingOf.access);
        log.append(log.getLogDir(), logOptions);

        return res.status(200).json({ success: true, data: cachedFiles });
    } catch (error) {
        const log: RouteLogger = new RouteLogger("files");
        log.setMessage(`Error encountered while trying to get files from Redis. Error message: "${error}"`);
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

export { router as filesRouter }
