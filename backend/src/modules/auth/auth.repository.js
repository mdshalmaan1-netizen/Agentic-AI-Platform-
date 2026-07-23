import prisma from '../../config/database.js';

export class AuthRepository {
  static async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });
  }

  static async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  static async findByGoogleId(googleId) {
    return prisma.user.findUnique({
      where: { googleId },
      include: { profile: true },
    });
  }

  static async createUser({ email, passwordHash, googleId = null, role = 'USER', name = '' }) {
    return prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        googleId,
        role,
        emailVerified: !!googleId,
        profile: {
          create: {
            name: name || email.split('@')[0],
            email: email.toLowerCase(),
          },
        },
      },
      include: { profile: true },
    });
  }

  static async updateRefreshToken(userId, refreshToken) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken, lastLoginAt: new Date() },
    });
  }
}

export default AuthRepository;
