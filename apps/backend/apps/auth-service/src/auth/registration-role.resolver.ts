import { UnauthorizedException } from '@nestjs/common';
import {
  ADMIN_ONLY_ROLE_NAMES,
  PUBLIC_REGISTRATION_ROLE_NAMES,
  SYSTEM_ROLE_NAMES,
  SystemRoleName,
} from '@ef/common';

/**
 * Default temporal mientras RegisterDto no expone selección de rol.
 * Sustituir por el valor enviado desde el formulario cuando el contrato lo permita.
 */
const TEMPORARY_DEFAULT_REGISTRATION_ROLE = SYSTEM_ROLE_NAMES.JUGADOR;

function isPublicRegistrationRole(value: string): value is SystemRoleName {
  return (PUBLIC_REGISTRATION_ROLE_NAMES as readonly string[]).includes(value);
}

function isAdminOnlyRole(value: string): boolean {
  return (ADMIN_ONLY_ROLE_NAMES as readonly string[]).includes(value);
}

/**
 * Resuelve el rol para registro público (Viewer | Jugador).
 * Rechaza Empresario y Administrador.
 */
export function resolvePublicRegistrationRole(
  explicitRole?: string,
): SystemRoleName {
  const candidate = explicitRole?.trim() || TEMPORARY_DEFAULT_REGISTRATION_ROLE;

  if (isAdminOnlyRole(candidate)) {
    throw new UnauthorizedException(
      'Role cannot be assigned through public registration',
    );
  }

  if (!isPublicRegistrationRole(candidate)) {
    throw new UnauthorizedException('Invalid role for public registration');
  }

  return candidate;
}
