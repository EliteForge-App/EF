import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { MESSAGE_PATTERNS, SERVICE_NAMES, toHttpException } from '@ef/common';
import {
  UpdatePreferencesDto,
  UpdateProfileDto,
  UserPreferences,
  UserProfile,
} from '@ef/contracts';

@Injectable()
export class UsersProxyService {
  constructor(
    @Inject(SERVICE_NAMES.USERS) private readonly usersClient: ClientProxy,
  ) {}

  findById(id: string): Promise<UserProfile> {
    return this.send<UserProfile>(MESSAGE_PATTERNS.USERS.FIND_BY_ID, { id });
  }

  updateProfile(id: string, dto: UpdateProfileDto): Promise<UserProfile> {
    return this.send<UserProfile>(MESSAGE_PATTERNS.USERS.UPDATE_PROFILE, {
      id,
      ...dto,
    });
  }

  getPreferences(userId: string): Promise<UserPreferences> {
    return this.send<UserPreferences>(MESSAGE_PATTERNS.USERS.GET_PREFERENCES, {
      userId,
    });
  }

  updatePreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<UserPreferences> {
    return this.send<UserPreferences>(MESSAGE_PATTERNS.USERS.UPDATE_PREFERENCES, {
      userId,
      preferences: dto.preferences,
    });
  }

  private send<T>(pattern: string, payload: unknown): Promise<T> {
    return firstValueFrom(
      this.usersClient.send<T>(pattern, payload).pipe(
        catchError((error: unknown) =>
          throwError(() => toHttpException(error)),
        ),
      ),
    );
  }
}
