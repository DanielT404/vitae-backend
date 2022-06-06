import { SendEmailCommand } from '@aws-sdk/client-ses'
import { sesClient } from './client.js'

const sendEmail = async (name, email, message) => {
    const params = {
        Destination: {
            ToAddresses: [process.env.AWS_SES_EMAIL],
        },
        Message: {
            Subject: {
                Data: `${name} just sent you a new message!`,
            },
            Body: {
                Html: {
                    Data: `<h1 style="font-weight: 400; font-size: 1.5rem">${name} just sent you a new message! <br/>
                           <p style="font-weight: 300; font-size: 1rem">${message}</p>
                           <hr/>
                           <h6>Contact email: ${email}</h6>
                          `,
                },
            },
        },
        Source: process.env.AWS_SES_EMAIL,
    }
    try {
        const command = new SendEmailCommand(params)
        const response = await sesClient.send(command)
        return response
    } catch (err) {
        throw new Error(err)
    }
}

export { sendEmail }
