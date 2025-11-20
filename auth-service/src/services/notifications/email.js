const fs = require('fs');
const path = require('path');
const axios = require('axios');

class EmailSender {
    constructor({ oneSignalAppId, oneSignalApiKey }) {
        this.appId = oneSignalAppId;
        this.apiKey = oneSignalApiKey;
    }

    async sendEmail({ toEmail, subject, template, variables }) {
        try {
            const templatePath = path.join(__dirname, '../../shared/templates', template);

            let html = fs.readFileSync(templatePath, 'utf8');
            html = html.replace(/{{(\w+)}}/g, (_, key) => variables[key] || '');

            const targetUrl = 'https://api.onesignal.com/notifications?c=email';
            const method = 'post';
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Key ${this.apiKey}`
            }
            const body = {
                app_id: this.appId,
                email_to: [toEmail],
                email_subject: subject,
                email_from_name: 'APP',
                email_body: html,
            }

            const response = await axios({
                method,
                url: targetUrl,
                data: body,
                timeout: 15000,
                headers,
            });

            return { success: true, data: response.data, message: 'Send email' };
        } catch (error) {
            throw new Error('Send email error: ' + error.message);
        }
    }
}

module.exports = EmailSender;
