import { SESClient } from '@aws-sdk/client-ses'

const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESSKEY as string,
        secretAccessKey: process.env.AWS_SES_SECRETACCESSKEY as string,
    },
})

export { sesClient }
