import { S3Client } from '@aws-sdk/client-s3'
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    },
})
export { s3Client }
