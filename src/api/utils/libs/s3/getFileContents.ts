import { GetObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from './client';

const getFileContents = async (fileName: string) => {
    const streamToString = (stream: any) =>
        new Promise((resolve, reject) => {
            const chunks : Uint8Array[] = []
            stream.on('data', (chunk: Uint8Array) => chunks.push(chunk))
            stream.on('error', reject)
            stream.on('end', () =>
                resolve(Buffer.concat(chunks).toString('utf8'))
            )
        })

    const { Body } = await s3Client.send(
        new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: fileName })
    )
    const bodyContents = await streamToString(Body)
    return bodyContents
}

export { getFileContents }
