import path from 'path';
import { readdir, truncate } from 'fs/promises';
import { getCurrentTime } from 'utils/date/getCurrentTime';

async function clearLogsRecursively(defaultPath = path.join(process.cwd(), 'logs')) {
    try {
        const files = await readdir(defaultPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.join(defaultPath, file.name);
                await truncate(filePath, 0);
            }
            if (file.isDirectory()) {
                clearLogsRecursively(path.join(defaultPath, file.name));
            }
        }
    } catch (error) {
        console.error(error);
    }
    return `[${getCurrentTime()} | CRON: clear logs] Succesfully cleared logs.`;
}

export { clearLogsRecursively }