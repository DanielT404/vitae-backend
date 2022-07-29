import fs from 'fs'
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { s3Client } from './client';

import { getCurrentTime } from 'utils/date/getCurrentTime';

const uploadArchivedLogsToS3 = async (filePath: string, fileName: string) => {
    const s3client = s3Client(process.env.AWS_REGION as string, process.env.AWS_S3_LOGS_ACCESSKEY as string, process.env.AWS_S3_LOGS_SECRETACCESSKEY as string);
    const archivedFile = fs.createReadStream(filePath);
    const input: PutObjectCommandInput = {
        Bucket: process.env.AWS_S3_LOGS_BUCKET,
        Key: fileName,
        Body: archivedFile
    };
    const command = new PutObjectCommand(input);
    await s3client.send(command);
    return `[${getCurrentTime()} | CRON: upload archived logs to S3] Succesfully uploaded archived log to S3.`;
}

export { uploadArchivedLogsToS3 }
