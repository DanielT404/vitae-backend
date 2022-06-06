import { createClient } from 'redis'
import { customLogReport } from '../../customLogReport.js';

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