import fs from 'fs';
import { getCurrentTime } from 'utils/date/getCurrentTime';
import archiver from 'archiver';

async function archiveLogs(input: string, output: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const destination = fs.createWriteStream(output);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        archive.on('error', function (err: unknown) {
            reject(err as string)
            throw err;
        });
        archive.pipe(destination);
        archive.directory(input, false);
        destination.on('close', function () {
            resolve(`[${getCurrentTime()} | CRON: archive logs] Succesfully archived logs. ${archive.pointer()} bytes written.`);
        });
        archive.finalize();
    })
}

export { archiveLogs }