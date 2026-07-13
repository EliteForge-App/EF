# Elite Forge Web

Landing page, registro de jugadores y portal **admin** B2B para dueños de canchas y empresarios. La app móvil es el canal principal para jugadores.

**Repositorio:** [github.com/AlexisMafla/elite-forge-web](https://github.com/AlexisMafla/elite-forge-web)

---

## Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Estilos | Tailwind CSS 4, shadcn/ui, Lucide Icons |
| Auth + DB | NestJS (API Gateway) + PostgreSQL (Prisma) |
| Gráficos | Recharts |
| Analytics | Vercel Analytics |
| Deploy | Hostinger Node.js Web Apps |

---

## Requisitos

- **Node.js** >= 20
- **npm** (recomendado para deploy en Hostinger)
- Plan Hostinger **Business** o **Cloud** con Node.js Web Apps (para producción)

---

## Inicio rápido

### 1. Clonar e instalar

```bash
git clone https://github.com/AlexisMafla/elite-forge-web.git
cd elite-forge-web
npm install
```

### 2. Variables de entorno

Copia el ejemplo y ajusta URLs según tu entorno:

```bash
cp .env.example .env.local
```

```env
API_GATEWAY_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SITE_URL=http://localhost:5173
```

### 3. Ejecutar en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linter ESLint |

---

## Estructura del proyecto

```
elite-forge-web/
├── app/
│   ├── page.tsx              # Landing
│   ├── auth/                 # Registro, confirmación, recuperar contraseña
│   └── admin/                # Portal B2B (Empresario, Administrador)
├── components/
│   ├── ui/                   # Componentes shadcn/ui
│   ├── landing/              # Secciones de la landing
│   └── admin/                # Sidebar y header del portal admin
├── lib/
│   ├── admin/                # Roles y sesión admin
│   ├── dal/admin/            # DAL reservas y venues (API Gateway)
├── public/                   # Assets estáticos
├── middleware.ts             # Cookie ef_token + guards /admin
├── hostinger.json            # Config de deploy en Hostinger
└── next.config.mjs           # Cache-Control anti-caché para HTML
```

---

## Flujo de autenticación

### Jugadores (registro público)

1. El usuario se registra en `/auth/sign-up` (nombre, email, posición, contraseña).
2. (Opcional) Si en el futuro implementamos recuperación/confirmación por email, se añadirá aquí.
3. El enlace redirige a `/auth/confirm` o `/auth/callback`, que crea la sesión.
4. Un trigger SQL crea las filas en `profiles` y `player_stats`.
5. Tras confirmar, se muestra `/auth/confirmed` con enlace para descargar la app móvil.

Los jugadores **no tienen panel web**; usan la app móvil con las mismas credenciales.

### Administradores de canchas y empresarios

1. Acceden a `/admin/login` (no aparece en la navegación pública).
2. Tras iniciar sesión, la web guarda un `accessToken` en la cookie `ef_token`.
3. El middleware exige esa cookie para cualquier ruta `/admin/*`.

---

## Deploy en Hostinger

Requisito: plan **Business** o **Cloud** con **Node.js Web Apps**.

### Pasos en hPanel

1. **Websites → Add Website → Node.js Apps**
2. **Import Git Repository** → conectar GitHub → seleccionar `elite-forge-web`
3. Configurar build:

| Setting | Valor |
|---------|--------|
| Install command | `npm ci` |
| Build command | `npm run build` |
| Start command | `npm run start -- -p $PORT` |
| Node.js version | 20.x |

4. Añadir variables de entorno **antes de hacer Deploy** (obligatorio):

```env
API_GATEWAY_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SITE_URL=http://localhost:5173
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

> **Importante:** Las variables `NEXT_PUBLIC_*` deben existir **durante el build**, no solo al arrancar. Si las añades después, pulsa **Redeploy** para que se reconstruya la app.

5. Pulsar **Deploy** y conectar tu dominio.

La configuración también está en [`hostinger.json`](hostinger.json).

### Error "Internal Server Error" (500)

La causa más común es **no haber configurado las variables de entorno** en hPanel, o no haber hecho **Redeploy** después de añadirlas.

1. Ve a tu sitio en hPanel → **Deployments** → **Environment variables**
2. Añade las 3 variables (usa tu URL real de Hostinger como `NEXT_PUBLIC_SITE_URL`):

```env
API_GATEWAY_URL=https://TU-API-PUBLICA.com
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SITE_URL=https://TU-DOMINIO.com
NEXT_PUBLIC_SITE_URL=https://sandybrown-pigeon-607893.hostingersite.com
```

3. Pulsa **Redeploy** (obligatorio tras cambiar variables o actualizar código desde GitHub)
4. Revisa los logs en **Deployments** si sigue fallando

Configura tu API pública en `API_GATEWAY_URL` (por ejemplo `https://api.eliteforge.com`).

- Site URL: `https://sandybrown-pigeon-607893.hostingersite.com`
- Redirect URLs:
  - `https://sandybrown-pigeon-607893.hostingersite.com/auth/callback`
  - `https://sandybrown-pigeon-607893.hostingersite.com/auth/confirm`
  - `https://sandybrown-pigeon-607893.hostingersite.com/admin/**`

### Caché en producción (Hostinger)

La app envía `Cache-Control: no-store` en HTML y rutas dinámicas (`next.config.mjs` + middleware). Los assets con hash en `/_next/static/` se cachean de forma inmutable (correcto).

Si tras un deploy sigues viendo una versión antigua **incluso en incógnito**, purga la caché del servidor:

| Paso | Dónde en hPanel |
|------|-----------------|
| Confirmar deploy exitoso del último commit | **Deployments** → logs |
| Redeploy tras cambiar variables `NEXT_PUBLIC_*` | **Deployments** → **Redeploy** |
| Vista sin caché | **Overview** → **No cache preview** |
| Purgar caché del sitio | **Cache Manager** → **Purge All** |
| Si CDN activo | **CDN** → **Flush cache** |

Verificación: en incógnito, la landing debe mostrar **Registro gratis** + **Descargar** (no «Iniciar sesión»). El footer muestra `Build: …` con el identificador del deploy.

---

## Integración con la app móvil

La app móvil y la web consumen el **mismo backend NestJS**. La web sirve como landing y portal admin; jugadores usan principalmente la app móvil.

Copia de desarrollo en GitLab: `elite-forge-main/web/` (sincronizar tras cada hito desde este repo).

---

## Documentación oficial

| Tecnología | Enlace |
|------------|--------|
| Next.js | [nextjs.org/docs](https://nextjs.org/docs) |
| React | [react.dev](https://react.dev) |
| TypeScript | [typescriptlang.org/docs](https://www.typescriptlang.org/docs) |
| Tailwind CSS | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| shadcn/ui | [ui.shadcn.com](https://ui.shadcn.com) |
| NestJS | [docs.nestjs.com](https://docs.nestjs.com) |
| Prisma | [prisma.io/docs](https://www.prisma.io/docs) |
| Recharts | [recharts.org](https://recharts.org) |
| Hostinger Node.js | [hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/) |

---

## Licencia

Proyecto privado — Elite Forge.
