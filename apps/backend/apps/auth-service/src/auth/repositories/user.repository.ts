import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@ef/database';
import { resolvePublicRegistrationRole } from '../registration-role.resolver';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  name: string;
  /** Rol explícito cuando el formulario de registro lo envíe (futuro). */
  registrationRole?: string;
}

export interface AuthUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toAuthUserRecord(user) : null;
  }

  async findById(id: string): Promise<AuthUserRecord | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toAuthUserRecord(user) : null;
  }

  async create(data: CreateUserData): Promise<AuthUserRecord> {
    const roleName = resolvePublicRegistrationRole(data.registrationRole);
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new InternalServerErrorException(
        `System role "${roleName}" is not seeded. Run npm run prisma:seed.`,
      );
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstname: data.name,
        lastname: '',
        roleId: role.id,
      },
    });

    return this.toAuthUserRecord(user);
  }

  private toAuthUserRecord(user: {
    id: string;
    email: string;
    passwordHash: string;
    firstname: string;
    lastname: string;
  }): AuthUserRecord {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      name: [user.firstname, user.lastname]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(' '),
    };
  }
}
