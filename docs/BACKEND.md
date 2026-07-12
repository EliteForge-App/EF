# Elite Forge — Documentación Backend

Registro técnico del backend en el monorepo `EF`. Para producto y negocio, ver [ELITE_FORGE.md](./ELITE_FORGE.md). Para el frontend móvil, ver [FRONTEND.md](./FRONTEND.md).

---

## Overview

El backend vive en `apps/backend/` y sigue una arquitectura de **microservicios NestJS** expuestos al exterior únicamente a través del **API Gateway**.

```
Cliente (mobile / web)
        │
        ▼
  API Gateway (:3000/api)     ← único punto HTTP público
        │ TCP
        ├── auth-service (:3001)
        └── users-service (:3002)
                │
        ┌───────┴───────┐
        ▼               ▼
   PostgreSQL        MongoDB
   (relacional)    (documentos)
```

**Importante:** el frontend **nunca** debe llamar directamente a `auth-service` ni `users-service`. Siempre consume el API Gateway en `/api/*`.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | NestJS 11 |
| Comunicación interna | TCP (MessagePattern) |
| SQL | PostgreSQL 16 + TypeORM |
| Documentos | MongoDB 7 + Mongoose |
| Auth | JWT (bcrypt + @nestjs/jwt) |
| Contenedores | Docker Compose |
| Contratos compartidos | `libs/contracts` |

---

## Servicios

| Servicio | Puerto TCP | Puerto HTTP | Responsabilidad |
|----------|------------|-------------|-----------------|
| api-gateway | — | 3000 | Proxy REST → microservicios |
| auth-service | 3001 | — | Registro, login, validación JWT |
| users-service | 3002 | — | Perfiles y preferencias |

---

## Base de datos — PostgreSQL

**Conexión local (Docker):**

| Parámetro | Valor |
|-----------|-------|
| Host | `localhost` |
| Puerto host | `5433` (mapeado desde 5432 del contenedor) |
| Usuario | `ef_user` |
| Contraseña | `ef_password` |
| Base de datos | `ef_db` |

### Tablas actuales

#### `users` (auth-service)

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid | PK, auto-generado |
| `email` | varchar | único |
| `passwordHash` | varchar | bcrypt |
| `name` | varchar | |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

Entidad: `apps/backend/apps/auth-service/src/auth/entities/user.entity.ts`

#### `user_profiles` (users-service)

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid | PK (= user id) |
| `email` | varchar | único |
| `name` | varchar | |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

Entidad: `apps/backend/apps/users-service/src/users/entities/user-profile.entity.ts`

### Sincronización en desarrollo

`PostgresDatabaseModule` usa `synchronize: true` cuando `NODE_ENV !== 'production'`. Las tablas se crean/actualizan al arrancar el servicio. **En producción se deben usar migraciones.**

---

## Base de datos — MongoDB

**Conexión local (Docker):**

```
mongodb://ef_user:ef_password@localhost:27017/ef_mongo?authSource=admin
```

### Colecciones actuales

#### `user_preferences` (users-service)

| Campo | Tipo | Notas |
|-------|------|-------|
| `userId` | string | único |
| `theme` | `light` \| `dark` | default `light` |
| `language` | string | default `es` |
| `notifications` | boolean | default `true` |
| `metadata` | object | libre |

Schema: `apps/backend/apps/users-service/src/users/schemas/user-preferences.schema.ts`

---

## API Gateway — Endpoints

Prefijo global: `/api`

### Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del gateway |

### Auth (proxy → auth-service)

#### Registro de usuarios — portal web externo

La **creación de cuentas** se realiza en el portal web de Hostinger, no desde la app móvil:

| Canal | URL / endpoint | Uso |
|-------|----------------|-----|
| **Web (principal)** | https://sandybrown-pigeon-607893.hostingersite.com/auth/sign-up | Registro de nuevos usuarios |
| App móvil | Enlace "Crear cuenta" en Login → abre la URL anterior en el navegador | Sin formulario nativo de registro |
| API Gateway | `POST /api/auth/register` | Disponible para integraciones; la app móvil no lo consume directamente |

Tras registrarse en la web, el usuario inicia sesión en la app con `POST /api/auth/login` (misma tabla `users` en PostgreSQL si el portal web persiste ahí).

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| POST | `/api/auth/register` | `{ email, password, name }` | `{ accessToken, user }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ accessToken, user }` |
| POST | `/api/auth/validate` | `{ token }` | `{ valid, userId?, email? }` |

**Respuesta exitosa de login/register:**

```json
{
  "accessToken": "<JWT>",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Nombre"
  }
}
```

**Error 401 (credenciales inválidas):**

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "timestamp": "...",
  "path": "/api/auth/login"
}
```

### Users (proxy → users-service)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users/:id` | Obtener perfil |
| PATCH | `/api/users/:id/profile` | Actualizar perfil |
| GET | `/api/users/:id/preferences` | Preferencias (MongoDB) |
| PATCH | `/api/users/:id/preferences` | Actualizar preferencias |

---

## Arquitectura interna (microservicios)

Los microservicios no exponen HTTP. Se comunican por **TCP** con `MessagePattern`:

```typescript
// auth-service
@MessagePattern('auth.login')
login(@Payload() dto: LoginDto) { ... }
```

El API Gateway inyecta un cliente TCP y reenvía las peticiones HTTP:

```
POST /api/auth/login  →  AuthProxyService  →  TCP  →  auth-service
```

---

## Docker

```bash
npm run docker:build   # Construir imágenes
npm run docker:up      # Levantar stack completo (modo full Docker)
npm run docker:down    # Detener stack
```

Archivos: `infrastructure/docker/`

| Contenedor | Imagen | Puerto host |
|------------|--------|-------------|
| ef-api-gateway | docker-api-gateway | 3000 |
| ef-auth-service | docker-auth-service | (interno) |
| ef-users-service | docker-users-service | (interno) |
| ef-postgres | postgres:16-alpine | 5433 |
| ef-mongodb | mongo:7 | 27018 |

### Desarrollo híbrido vs full Docker

- **Híbrido:** `docker compose ... up postgres mongodb -d` + microservicios con `npm run start:*` en local. Ver [README — desarrollo local](../README.md#3-backend--desarrollo-local-modo-hibrido).
- **Full Docker:** `npm run docker:up` — no arranques gateway/auth/users en local a la vez.

---

## Variables de entorno

Ver `.env.example` en la raíz del monorepo.

---

## Registro de cambios

### 2026-07-04 — Registro de usuarios vía portal web (Hostinger)

- La app móvil deja de navegar a `RegisterScreen` al pulsar "Crear cuenta".
- El enlace abre `https://sandybrown-pigeon-607893.hostingersite.com/auth/sign-up` en el navegador externo.
- URL usada directamente en `LoginScreen.tsx`: `https://sandybrown-pigeon-607893.hostingersite.com/auth/sign-up`
- **Sin cambios de código backend**; `POST /api/auth/register` sigue disponible en el API Gateway.
- `RegisterScreen` permanece en el stack por compatibilidad (placeholder).

### 2026-07-04 — Integración mobile ↔ auth (sin cambios de código backend)

- El frontend móvil se conectó al endpoint existente `POST /api/auth/login` vía API Gateway.
- No se modificó código backend en esta integración.
- Tabla `users` en PostgreSQL ya existía y soporta register/login.
- Documento `BACKEND.md` creado como referencia del estado actual.

### 2026-07-04 — Dockerfiles monorepo

- Contexto de build movido a la raíz del monorepo para `npm ci` con `package-lock.json`.
- Multi-stage build para api-gateway, auth-service, users-service.
- Puerto Postgres en host cambiado a `5433` (conflicto con Postgres local en 5432).
- Fix import en `user.repository.ts` (`../entities/user.entity`).

---

## Próximos pasos sugeridos

- [ ] Crear perfil en `user_profiles` al registrar usuario (sincronizar auth ↔ users).
- [ ] Migraciones TypeORM para producción.
- [ ] Ampliar entidad `users` si se requieren campos adicionales de auth.
- [ ] Refresh tokens / revocación de sesiones.
