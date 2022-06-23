import express from 'express';

// redis utils
import { client } from 'utils/libs/redis/init';
import { config } from 'utils/libs/redis/config';

// s3 utils
import { getFiles } from 'utils/libs/s3/getFilesFromBucket';
import { modelFiles } from 'utils/libs/s3/utils/modelFiles';

// logging
import { LoggingOf } from 'utils/logging/enum/LoggingOf';
import { RouteLogger } from 'utils/logging/routes/RouteLogger';
import { generateHttpOptions } from 'utils/logging/routes/functions/generateHttpOptions';
import { Services } from 'utils/logging/enum/Services';

const router = express.Router()
router.get('/', async (req, res) => {
    const logOptions = {
        http: generateHttpOptions(req)
    };
    try {
        const cachedFiles = await client.get("files");
        if (cachedFiles) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedFiles) });
        }
    } catch (error) {
        const log : RouteLogger = new RouteLogger(
            `Error encountered while trying to get files from Redis. \n \tError message: "${error}"`, 
            'files', 
            LoggingOf.error, 
            Services.redis
        );
        log.append(
            log.getFilePath(),
            logOptions
        );
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
        const log : RouteLogger = new RouteLogger(
            `Error encountered while trying to get files. \n \tError message: "${error}"`, 
            'files',
            LoggingOf.error, 
            Services.S3
        );
        log.append(
            log.getFilePath(), 
            logOptions
        );
        return res.status(500).json({
            success: false,
            message:
                "Service is temporarily unavailable, please try again later.",
        })
    }
})

export { router as filesRouter }
