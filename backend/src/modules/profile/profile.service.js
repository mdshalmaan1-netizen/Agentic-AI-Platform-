import ProfileRepository from './profile.repository.js';
import { NotFoundError } from '../../shared/utils/AppError.js';

export class ProfileService {
  static async getProfile(userId) {
    const profile = await ProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }
    return profile;
  }

  static async updateProfile(userId, profileData) {
    return ProfileRepository.updateByUserId(userId, profileData);
  }
}

export default ProfileService;
