import * as express from 'express';
import fetch from 'node-fetch'
import { check, validationResult } from 'express-validator'

// ses utils
import  { sendEmail } from '../../utils/libs/ses/sendEmail';

// logging
import { LoggingOf } from 'utils/logging/enum/LoggingOf';
import { RouteLogger } from 'utils/logging/routes/RouteLogger';
import { generateHttpOptions } from 'utils/logging/routes/functions/generateHttpOptions';

// mail error formatter
import { ErrorFormatter, ErrorFormatterMethod, ErrorFormatterTypes } from 'utils/formatters/ErrorFormatter';
import { Services } from 'utils/logging/enum/Services';


const router = express.Router()
router.post(
    "/",
    [
        check("secret").not().isEmpty(),
        check("token").not().isEmpty(),
        check("message").isLength({ min: 15 }).trim().escape(),
        check("email").isEmail().normalizeEmail(),
        check("name").isLength({ min: 3 }).trim().escape(),
    ],
    async (req: express.Request, res: express.Response) => {
        const logOptions = { 
            http: generateHttpOptions(req) 
        };

        const errorFormatter : any = new ErrorFormatter(ErrorFormatterTypes.Email, ErrorFormatterMethod.POST);
        const errors = validationResult(req).formatWith(errorFormatter.getErrorMessage);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name, email, message, secret, token } = req.body
        const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"
        const verify = await fetch(VERIFY_URL, {
            method: "POST",
            body: `secret=${secret}&response=${token}`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        const verification : any = await verify.json()
        if (verification.success) {
            try {
                let { MessageId } = await sendEmail(name, email, message)
                return res.status(200).json({
                    success: true,
                    messageId: MessageId,
                    message:
                        "Your message has been sent succesfully. Keep in touch!",
                })
            } catch (error) {
                const log : RouteLogger = new RouteLogger(
                    `Error encountered while trying to send email. Error message: "${error}" \n`, 
                    'email',
                    LoggingOf.error, 
                    Services.SES
                );
                log.append(log.getFilePath(), logOptions);
                    
                return res.status(500).json({
                    success: false,
                    message:
                        "Service is temporary unavailable, please try again later.",
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Please retry reCAPTCHA challenge.",
            })
        }
    }
)

export { router as emailRouter }
