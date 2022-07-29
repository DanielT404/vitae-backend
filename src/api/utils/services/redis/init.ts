import { createClient } from 'redis'
import { LoggingOf } from 'utils/logging/enum/LoggingOf';
import { Services } from 'utils/logging/enum/Services';
import { ServiceLogger } from 'utils/logging/services/ServiceLogger';

const client = createClient({
    url: process.env.REDIS_ENDPOINT_URL as string
});

async function initializeRedis() {
    await client.connect();
    client.on("error", (err) => {
        const log = new ServiceLogger();
        log.setMessage(`Redis client error: ${err}`);
        log.setLoggingOf(LoggingOf.error);
        log.setService(Services.redis);
        log.append(log.getFilePath());

        throw new Error(`Redis client error: ${err}`);
    })
    const log: ServiceLogger = new ServiceLogger();
    log.setMessage('Redis client is active...');
    log.setLoggingOf(LoggingOf.connect);
    log.setService(Services.redis);
    log.append(log.getFilePath());
}

export { client, initializeRedis }
