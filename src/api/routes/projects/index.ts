import * as express from 'express';

// redis utils
import { client } from '../../../../utils/libs/redis/init';
import { config } from '../../../../utils/libs/redis/config';

// dynamodb utils
import { getProjects } from '../../../../utils/libs/dynamodb/getProjects';

// logging
import { customLogReport } from '../../../../utils/customLogReport';

const router = express.Router()
router.get('/', async (req, res) => {
    try {
        const cachedProjects = await client.get("projects");
        if (cachedProjects) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedProjects) });
        }
    } catch (error) {
        customLogReport(
            "redis",
            `Error encountered while trying to get projects from Redis client. Error message: "${error}" \n`
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
            "projects",
            `Error encountered while trying to get projects. Error message: "${error}" \n`
        )
        return res.status(500).json({
            success: false,
            message: "Service is temporarily unavailable, please try again later."
        })
    }
})

export { router as projectsRouter }