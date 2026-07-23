import nodemailer from 'nodemailer';
import config from '../../../config/index.js';

let transporter = null;

if (config.email.user && config.email.pass) {
  try {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
    console.log('✅ Nodemailer Email transporter initialized');
  } catch (error) {
    console.warn('⚠️ Nodemailer initialization failed:', error.message);
  }
}

export class EmailChannel {
  static async sendMail(toEmail, subject, htmlContent) {
    if (!transporter) {
      console.warn(`[Email Stub Log] To: ${toEmail} | Subject: ${subject}`);
      return { status: 'mock_sent', subject };
    }

    try {
      const info = await transporter.sendMail({
        from: config.email.from,
        to: toEmail,
        subject,
        html: htmlContent,
      });
      return info;
    } catch (error) {
      console.error('Email send error:', error.message);
      return { status: 'failed', error: error.message };
    }
  }
}

export default EmailChannel;
