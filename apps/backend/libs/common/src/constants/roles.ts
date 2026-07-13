export const SYSTEM_ROLE_NAMES = {
  VIEWER: 'Viewer',
  JUGADOR: 'Jugador',
  EMPRESARIO: 'Empresario',
  ADMINISTRADOR: 'Administrador',
} as const;

export type SystemRoleName =
  (typeof SYSTEM_ROLE_NAMES)[keyof typeof SYSTEM_ROLE_NAMES];

/** Roles asignables únicamente desde registro público (POST /api/auth/register). */
export const PUBLIC_REGISTRATION_ROLE_NAMES = [
  SYSTEM_ROLE_NAMES.VIEWER,
  SYSTEM_ROLE_NAMES.JUGADOR,
] as const satisfies readonly SystemRoleName[];

/** Roles reservados para futuros endpoints administrativos. */
export const ADMIN_ONLY_ROLE_NAMES = [
  SYSTEM_ROLE_NAMES.EMPRESARIO,
  SYSTEM_ROLE_NAMES.ADMINISTRADOR,
] as const satisfies readonly SystemRoleName[];

export const SYSTEM_ROLES_SEED: ReadonlyArray<{
  name: SystemRoleName;
  description: string;
}> = [
  {
    name: SYSTEM_ROLE_NAMES.VIEWER,
    description: 'Acceso de solo lectura a contenido público.',
  },
  {
    name: SYSTEM_ROLE_NAMES.JUGADOR,
    description: 'Usuario jugador de la plataforma Elite Forge.',
  },
  {
    name: SYSTEM_ROLE_NAMES.EMPRESARIO,
    description: 'Gestión de negocio; asignación solo vía endpoints administrativos.',
  },
  {
    name: SYSTEM_ROLE_NAMES.ADMINISTRADOR,
    description: 'Administración del sistema; asignación solo vía endpoints administrativos.',
  },
];
