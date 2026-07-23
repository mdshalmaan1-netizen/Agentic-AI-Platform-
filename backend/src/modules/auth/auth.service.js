import AuthRepository from './auth.repository.js';
import { hashPassword, comparePassword } from '../../shared/utils/hash.js';
import { generateTokens, verifyRefreshToken } from '../../shared/utils/token.js';
import { BadRequestError, UnauthorizedError, ConflictError } from '../../shared/utils/AppError.js';
import { OAuth2Client } from 'google-auth-library';
import config from '../../config/index.js';

const googleClient = new OAuth2Client(config.google.clientId);

export class AuthService {
  static async register({ email, password, name }) {
    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await AuthRepository.createUser({ email, passwordHash, name });

    const tokens = generateTokens(user);
    await AuthRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  static async login({ email, password }) {
    const user = await AuthRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = generateTokens(user);
    await AuthRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  static async googleAuth(idToken) {
    if (!idToken) {
      throw new BadRequestError('Google ID Token is required');
    }

    let payload;
    try {
      if (config.google.clientId) {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: config.google.clientId,
        });
        payload = ticket.getPayload();
      } else {
        // Dev fallback if client ID is mock
        payload = {
          sub: 'google_mock_id_' + Date.now(),
          email: 'demo_google_user@example.com',
          name: 'Demo Google User',
        };
      }
    } catch (error) {
      throw new UnauthorizedError('Invalid Google authentication token');
    }

    const { sub: googleId, email, name } = payload;
    let user = await AuthRepository.findByGoogleId(googleId);

    if (!user) {
      user = await AuthRepository.findByEmail(email);
      if (user) {
        // Link googleId to existing user
        user = await AuthRepository.updateRefreshToken(user.id, user.refreshToken);
      } else {
        user = await AuthRepository.createUser({ email, googleId, name });
      }
    }

    const tokens = generateTokens(user);
    await AuthRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await AuthRepository.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Invalid refresh token session');
    }

    const tokens = generateTokens(user);
    await AuthRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }
}

export default AuthService;
