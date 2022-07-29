import { ListObjectsCommand } from '@aws-sdk/client-s3'
import { s3Client } from './client';

const bucketParams = { Bucket: process.env.AWS_S3_DESKTOP_BUCKET };
const getFiles = async () => {
    try {
        const s3client = s3Client(process.env.AWS_REGION as string, process.env.AWS_S3_DESKTOP_ACCESSKEY as string, process.env.AWS_S3_DESKTOP_SECRETACCESSKEY as string);
        const data = await s3client.send(new ListObjectsCommand(bucketParams));
        return data;
    } catch (err) {
        throw new Error(err as string);
    }
}

export { bucketParams, getFiles }
