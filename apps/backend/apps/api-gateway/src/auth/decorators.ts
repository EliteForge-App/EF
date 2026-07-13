import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { AuthTokenPayload } from '@ef/contracts';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthTokenPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthTokenPayload }>();
    return request.user;
  },
);
