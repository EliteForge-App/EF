/**
 * These are configuration settings for the production environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  API_URL: "https://api.eliteforge.com/api/",
  /**
   * Registro en apps/web (NestJS + Prisma) — ya no usar el portal Hostinger antiguo (Supabase).
   * Cuando apps/web esté desplegado en producción, sustituye por la URL pública, p.ej.:
   * https://tu-dominio.com/auth/sign-up
   *
   * Mientras pruebas en local/dispositivo, usa la IP LAN de tu PC (apps/web en :5173).
   */
  SIGN_UP_URL: "http://192.168.1.132:5173/auth/sign-up",
}
