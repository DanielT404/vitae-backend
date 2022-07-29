import { S3Client } from '@aws-sdk/client-s3'

const s3Client = (region: string, accessKey: string, secretAccessKey: string) => {
    return new S3Client({
        region: region,
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretAccessKey,
        },
    })
}

export { s3Client }
