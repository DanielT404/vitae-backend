import express from 'express';
import fetch from 'node-fetch';
import { check, validationResult } from 'express-validator';

// ses utils
import { sendEmail } from 'utils/services/ses/sendEmail';

// logging
import { LoggingOf } from 'utils/logging/enum/LoggingOf';
import { RouteLogger } from 'utils/logging/routes/RouteLogger';
import { generateHttpOptions } from 'utils/logging/routes/functions/generateHttpOptions';

// mail error formatter
import { ErrorFormatterFactory, ErrorFormatterMethod, ErrorFormatterTypes } from 'utils/formatters/ErrorFormatter';
import { Services } from 'utils/logging/enum/Services';

const router = express.Router();
router.post(
    "/",
    check("secret").not().isEmpty(),
    check("token").not().isEmpty(),
    check("message").isLength({ min: 15 }).trim().escape(),
    check("email").isEmail().normalizeEmail(),
    check("name").isLength({ min: 3 }).trim().escape(),
    async (req, res) => {
        const logOptions = {
            http: generateHttpOptions(req)
        };
        const factory = new ErrorFormatterFactory(ErrorFormatterMethod.POST);
        const mailErrorFormatter = factory.createFormatter(ErrorFormatterTypes.Email);
        const errors = validationResult(req).formatWith(mailErrorFormatter.getErrorMessage);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, message, secret, token } = req.body;
        const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
        const verify = await fetch(VERIFY_URL, {
            method: "POST",
            body: `secret=${secret}&response=${token}`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const verification = await verify.json();
        if (verification.success) {
            try {
                const { MessageId } = await sendEmail(name, email, message);

                const log: RouteLogger = new RouteLogger("email");
                log.setMessage("Email sent succesfully via AWS SES SDK.");
                log.setLoggingOf(LoggingOf.access);
                log.setService(Services.SES);
                log.append(log.getLogDir(), logOptions);

                return res.status(200).json({
                    success: true,
                    messageId: MessageId,
                    message:
                        "Your message has been sent succesfully. Keep in touch!",
                });
            } catch (error) {
                const log = new RouteLogger("email");
                log.setMessage(`Error encountered while trying to send email. Error message: "${error}"`);
                log.setLoggingOf(LoggingOf.error);
                log.setService(Services.SES);
                log.append(log.getLogDir(), logOptions);

                return res.status(500).json({
                    success: false,
                    message:
                        "Service is temporary unavailable, please try again later.",
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Please retry reCAPTCHA challenge.",
            });
        }
    }
)

export { router as emailRouter }
