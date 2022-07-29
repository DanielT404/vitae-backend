import { GetObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from './client';

const getFileContents = async (fileName: string) => {
    const streamToString = (stream) =>
        new Promise((resolve, reject) => {
            const chunks: Uint8Array[] = []
            stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () =>
                resolve(Buffer.concat(chunks).toString('utf8'))
            );
        })

    const s3client = s3Client(process.env.AWS_REGION as string, process.env.AWS_S3_DESKTOP_ACCESSKEY as string, process.env.AWS_S3_DESKTOP_SECRETACCESSKEY as string);
    const { Body } = await s3client.send(
        new GetObjectCommand({ Bucket: process.env.AWS_S3_DESKTOP_BUCKET, Key: fileName })
    );
    const bodyContents = await streamToString(Body as ReadableStream);
    return bodyContents;
}

export { getFileContents }
