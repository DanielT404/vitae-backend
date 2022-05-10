import { GetObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from './client.js'

const getFileContents = async (fileName) => {
    const streamToString = (stream) =>
        new Promise((resolve, reject) => {
            const chunks = []
            stream.on('data', (chunk) => chunks.push(chunk))
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
