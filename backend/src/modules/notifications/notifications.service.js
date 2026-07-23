import prisma from '../../config/database.js';
import WhatsAppChannel from './notification.channels/whatsapp.channel.js';
import EmailChannel from './notification.channels/email.channel.js';

export class NotificationsService {
  static async getUserNotifications(userId) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: 20,
    });
  }

  static async sendNotification({ userId, channel, type, title, body, metadata = null }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) return null;

    const notification = await prisma.notification.create({
      data: {
        userId,
        channel,
        type,
        title,
        body,
        metadata,
      },
    });

    if (channel === 'whatsapp' && user.profile?.phone) {
      await WhatsAppChannel.sendNotification(user.profile.phone, `${title}\n\n${body}`);
    } else if (channel === 'email' && user.email) {
      await EmailChannel.sendMail(
        user.email,
        title,
        `<div style="font-family: sans-serif; padding: 20px;"><h2>${title}</h2><p>${body}</p></div>`
      );
    }

    return notification;
  }
}

export default NotificationsService;
