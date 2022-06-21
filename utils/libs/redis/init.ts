import { createClient } from 'redis'
import { customLogReport } from '../../../utils/customLogReport';

const client = createClient({
    url: process.env.REDIS_ENDPOINT_URL as string
});

async function initializeRedis() {
    await client.connect();
    client.on("error", (err) => {
        throw new Error(`Redis client error: ${err}`);
    })
    customLogReport("redis.connect", "Redis client is active...");
}

export { client, initializeRedis }
