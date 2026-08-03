import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UpdatePreferencesDto,
  UserPreferences as UserPreferencesContract,
} from '@ef/contracts';
import {
  UserPreferences,
  UserPreferencesDocument,
} from '../schemas/user-preferences.schema';

@Injectable()
export class UserPreferencesRepository {
  constructor(
    @InjectModel(UserPreferences.name)
    private readonly model: Model<UserPreferencesDocument>,
  ) {}

  async findByUserId(userId: string): Promise<UserPreferencesContract> {
    let doc = await this.model.findOne({ userId }).exec();
    if (!doc) {
      doc = await this.model.create({ userId });
    }
    return this.toContract(doc);
  }

  async upsert(
    userId: string,
    preferences: UpdatePreferencesDto['preferences'],
  ): Promise<UserPreferencesContract> {
    const doc = await this.model
      .findOneAndUpdate(
        { userId },
        { $set: preferences },
        { new: true, upsert: true },
      )
      .exec();

    return this.toContract(doc!);
  }

  private toContract(doc: UserPreferencesDocument): UserPreferencesContract {
    return {
      userId: doc.userId,
      theme: doc.theme,
      language: doc.language,
      notifications: doc.notifications,
      metadata: doc.metadata,
    };
  }
}
