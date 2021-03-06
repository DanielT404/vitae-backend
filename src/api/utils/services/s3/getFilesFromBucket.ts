import { ListObjectsCommand } from '@aws-sdk/client-s3'
import { s3Client } from './client';

const bucketParams = { Bucket: process.env.S3_BUCKET }
const getFiles = async () => {
    try {
        const data = await s3Client.send(new ListObjectsCommand(bucketParams))
        return data
    } catch (err) {
        throw new Error(err as string)
    }
}

export { bucketParams, getFiles }
