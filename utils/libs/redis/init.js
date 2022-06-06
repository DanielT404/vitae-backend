import path from 'path'
import { fileURLToPath } from 'url'

import { createClient } from 'redis'

import { customLogReport } from '../../customLogReport.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = createClient({
    url: process.env.REDIS_ENDPOINT_URL
});

async function initializeRedis() {
    client.on("error", (err) => {
        throw new Error("Redis client error", err);
    })
    await client.connect();
    customLogReport("/app", "redis.connect", "Redis client is active...");
}

export { client, initializeRedis }