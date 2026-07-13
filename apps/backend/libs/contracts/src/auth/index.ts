import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @MinLength(2)
  name!: string;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface AuthMeResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ValidateTokenDto {
  token: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  userId?: string;
  email?: string;
}
