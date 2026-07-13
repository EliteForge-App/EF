function encodeCredential(value: string): string {
  return encodeURIComponent(value);
}

/**
 * Resolves PostgreSQL connection string for Prisma.
 * Prefers DATABASE_URL; falls back to POSTGRES_* (TypeORM legacy env vars).
 */
export function resolveDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const explicitUrl = env.DATABASE_URL?.trim();
  if (explicitUrl) {
    return explicitUrl;
  }

  const host = env.POSTGRES_HOST ?? 'localhost';
  const port = env.POSTGRES_PORT ?? '5432';
  const user = env.POSTGRES_USER ?? 'ef_user';
  const password = env.POSTGRES_PASSWORD ?? 'ef_password';
  const database = env.POSTGRES_DB ?? 'ef_db';

  return `postgresql://${encodeCredential(user)}:${encodeCredential(password)}@${host}:${port}/${database}?schema=public`;
}
