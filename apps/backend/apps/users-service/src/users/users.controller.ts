import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@ef/common';
import { UpdatePreferencesDto, UpdateProfileDto } from '@ef/contracts';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(MESSAGE_PATTERNS.USERS.FIND_BY_ID)
  findById(@Payload() data: { id: string }) {
    return this.usersService.findById(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.USERS.UPDATE_PROFILE)
  updateProfile(@Payload() data: UpdateProfileDto & { id: string }) {
    const { id, ...dto } = data;
    return this.usersService.updateProfile(id, dto);
  }

  @MessagePattern(MESSAGE_PATTERNS.USERS.GET_PREFERENCES)
  getPreferences(@Payload() data: { userId: string }) {
    return this.usersService.getPreferences(data.userId);
  }

  @MessagePattern(MESSAGE_PATTERNS.USERS.UPDATE_PREFERENCES)
  updatePreferences(
    @Payload() data: UpdatePreferencesDto & { userId: string },
  ) {
    const { userId, preferences } = data;
    return this.usersService.updatePreferences(userId, { preferences });
  }
}
