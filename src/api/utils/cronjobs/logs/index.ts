import path from 'path';
import { CronJob } from 'cron';

import { EVERY_DAY_AT_11_59_PM } from 'utils/cronjobs/logs/constants/cronRunningTimes';
import { createTemporaryDirectory } from 'utils/filesystem/createTemporaryDirectory';
import { archiveLogs } from 'utils/cronjobs/logs/archiveLogs';
import { uploadArchivedLogsToS3 } from 'utils/services/s3/uploadLogs';
import { removeTemporaryDirectory } from 'utils/filesystem/removeTemporaryDirectory';
import { clearLogsRecursively } from 'utils/cronjobs/logs/clearLogsRecursively';

async function RunCommands(): Promise<void> {
    const ymdFormat = new Date().toISOString().slice(0, 10);
    const timestamp = Date.now();
    const archiveFileName = `logs-${ymdFormat}-${timestamp}.zip`;
    const archivePath = path.join(process.cwd(), 'tmp', archiveFileName);
    await createTemporaryDirectory().then((message) => console.log(message)).catch((err) => { throw new Error(err) });
    await archiveLogs(path.join(process.cwd(), 'logs'), archivePath).then((message) => console.log(message)).catch((err) => { throw new Error(err) });
    await uploadArchivedLogsToS3(archivePath, archiveFileName).then((message) => console.log(message)).catch((err) => { throw new Error(err) });
    await removeTemporaryDirectory().then((message) => console.log(message)).catch((err) => { throw new Error(err) });
    await clearLogsRecursively().then((message) => console.log(message)).catch((err) => { throw new Error(err) });
}

const ArchiveAndClearLogsOnceADay = async () => {
    const CRON_ON_COMPLETE = null;
    const CRON_START_BY_DEFAULT = true;
    const CRON_TZ = 'Europe/Bucharest';
    return new CronJob(
        EVERY_DAY_AT_11_59_PM,
        RunCommands,
        CRON_ON_COMPLETE,
        CRON_START_BY_DEFAULT,
        CRON_TZ
    );
}
export { ArchiveAndClearLogsOnceADay } 