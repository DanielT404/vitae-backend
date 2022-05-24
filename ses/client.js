import { SESClient } from '@aws-sdk/client-ses'

const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESSKEY,
        secretAccessKey: process.env.AWS_SES_SECRETACCESSKEY,
    },
})

export { sesClient }
