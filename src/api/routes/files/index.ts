import * as express from 'express';

// redis utils
import { client } from '../../../../utils/libs/redis/init';
import { config } from '../../../../utils/libs/redis/config';

// s3 utils
import { getFiles } from '../../../../utils/libs/s3/getFilesFromBucket';
import { modelFiles } from '../../../../utils/libs/s3/utils/modelFiles';

// logging
import { customLogReport } from '../../../../utils/customLogReport';

const router = express.Router()
router.get('/', async (req, res) => {
    try {
        const cachedFiles = await client.get("files");
        if (cachedFiles) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedFiles) });
        }
    } catch (error) {
        customLogReport(
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

export { router as filesRouter }
