import prisma from '../../config/database.js';

export class ProfileRepository {
  static async findByUserId(userId) {
    return prisma.profile.findUnique({
      where: { userId },
    });
  }

  static async updateByUserId(userId, data) {
    return prisma.profile.upsert({
      where: { userId },
      update: {
        ...data,
        isOnboarded: true,
      },
      create: {
        userId,
        name: data.name || 'User',
        email: data.email || '',
        ...data,
        isOnboarded: true,
      },
    });
  }
}

export default ProfileRepository;
