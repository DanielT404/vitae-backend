import { createClient } from 'redis'
import { LoggingOf } from 'utils/logging/enum/LoggingOf';
import { ServiceLogger } from 'utils/logging/services/ServiceLogger';

const client = createClient({
    url: process.env.REDIS_ENDPOINT_URL as string
});

async function initializeRedis() {
    await client.connect();
    client.on("error", (err) => {
        throw new Error(`Redis client error: ${err}`);
    })
    const log : ServiceLogger = new ServiceLogger('Redis client is active...', LoggingOf.connect, 'redis');
    log.append(log.getFilePath());
}

export { client, initializeRedis }
