export * from './roles';

export const SERVICE_NAMES = {
  AUTH: 'AUTH_SERVICE',
  USERS: 'USERS_SERVICE',
} as const;

export const MESSAGE_PATTERNS = {
  AUTH: {
    LOGIN: 'auth.login',
    VALIDATE_TOKEN: 'auth.validate_token',
    REGISTER: 'auth.register',
  },
  USERS: {
    FIND_BY_ID: 'users.find_by_id',
    UPDATE_PROFILE: 'users.update_profile',
    GET_PREFERENCES: 'users.get_preferences',
    UPDATE_PREFERENCES: 'users.update_preferences',
  },
} as const;
