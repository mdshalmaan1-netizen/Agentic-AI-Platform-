import config from '../../../config/index.js';

let client = null;

if (config.twilio.accountSid && config.twilio.authToken) {
  try {
    const twilio = (await import('twilio')).default;
    client = twilio(config.twilio.accountSid, config.twilio.authToken);
    console.log('✅ Twilio WhatsApp client initialized');
  } catch (error) {
    console.warn('⚠️ Twilio initialization fallback mode active');
  }
}

export class WhatsAppChannel {
  static async sendNotification(toPhone, body) {
    if (!client) {
      console.warn(`[WhatsApp Stub Log] To: ${toPhone} | Message: ${body}`);
      return { status: 'mock_sent', message: body };
    }

    try {
      const message = await client.messages.create({
        from: config.twilio.whatsappNumber,
        to: `whatsapp:${toPhone}`,
        body,
      });
      return message;
    } catch (error) {
      console.error('WhatsApp send error:', error.message);
      return { status: 'failed', error: error.message };
    }
  }
}

export default WhatsAppChannel;
