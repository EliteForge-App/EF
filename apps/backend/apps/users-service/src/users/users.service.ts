import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdatePreferencesDto,
  UpdateProfileDto,
  UserPreferences,
  UserProfile,
} from '@ef/contracts';
import { UserProfileRepository } from './repositories/user-profile.repository';
import { UserPreferencesRepository } from './repositories/user-preferences.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly profileRepository: UserProfileRepository,
    private readonly preferencesRepository: UserPreferencesRepository,
  ) {}

  async findById(id: string): Promise<UserProfile> {
    const profile = await this.profileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      createdAt: profile.createdAt,
    };
  }

  async updateProfile(
    id: string,
    dto: UpdateProfileDto,
  ): Promise<UserProfile> {
    if (!dto.name) {
      return this.findById(id);
    }
    const updated = await this.profileRepository.updateName(id, dto.name);
    if (!updated) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      createdAt: updated.createdAt,
    };
  }

  getPreferences(userId: string): Promise<UserPreferences> {
    return this.preferencesRepository.findByUserId(userId);
  }

  updatePreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<UserPreferences> {
    return this.preferencesRepository.upsert(userId, dto.preferences);
  }
}
