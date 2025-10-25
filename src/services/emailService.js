// services/emailService.js
const { SendEmailCommand } = require("@aws-sdk/client-ses");

// The SESClient automatically inherits credentials from the EC2 IAM Role.
// Set the region to Mumbai (ap-south-1)
const { sesClient } = require("./sesClient");

const sendAppEmail = async (toEmail, subject, bodyHtml, bodyText) => {
    const params = {
        // CRITICAL: Must be an address from your verified domain
        Source: "no-reply@thesocialdev.in",
        Destination: {
            ToAddresses: [toEmail],
        },
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: bodyHtml,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: bodyText,
                },
            },
        },
    };

    try {
        const command = new SendEmailCommand(params);
        const result = await sesClient.send(command);
        console.log("Email sent successfully. Message ID:", result.MessageId);
        return result;
    } catch (error) {
        console.error("SES Email Error:", error);
        throw error;
    }
};

module.exports = { sendAppEmail };
