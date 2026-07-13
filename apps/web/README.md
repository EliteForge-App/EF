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
│   └── admin/                # Portal B2B (court_owner, court_staff, admin, business)
├── components/
│   ├── ui/                   # Componentes shadcn/ui
│   ├── landing/              # Secciones de la landing
│   └── admin/                # Sidebar y header del portal admin
├── lib/
│   ├── admin/                # Roles y sesión admin
│   ├── dal/admin/            # DAL reservas y venues (Supabase SSR)
│   └── supabase/             # Clientes Supabase (browser, server, middleware)
├── public/                   # Assets estáticos
├── supabase/migrations/      # Esquema SQL
├── middleware.ts             # Sesión Supabase + guards /admin
├── hostinger.json            # Config de deploy en Hostinger
└── next.config.mjs           # Cache-Control anti-caché para HTML
```

---

## Flujo de autenticación

### Jugadores (registro público)

1. El usuario se registra en `/auth/sign-up` (nombre, email, posición, contraseña).
2. Supabase envía un email de confirmación.
3. El enlace redirige a `/auth/confirm` o `/auth/callback`, que crea la sesión.
4. Un trigger SQL crea las filas en `profiles` y `player_stats`.
5. Tras confirmar, se muestra `/auth/confirmed` con enlace para descargar la app móvil.

Los jugadores **no tienen panel web**; usan la app móvil con las mismas credenciales.

### Administradores de canchas y empresarios

1. Acceden a `/admin/login` (no aparece en la navegación pública).
2. Tras iniciar sesión, el middleware valida `profiles.role`:
   - `court_owner` / `court_staff` → `/admin/reservas`
   - `admin` / `business` → `/admin/metricas`
3. Los roles `player`, `club` y `judge` reciben acceso denegado en el portal admin.

Asigna `court_owner` manualmente en Supabase al principio; el CTA «Licencia Manager» en la landing apunta a `/admin/login`.

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
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

> **Importante:** Las variables `NEXT_PUBLIC_*` deben existir **durante el build**, no solo al arrancar. Si las añades después, pulsa **Redeploy** para que se reconstruya la app.

5. Pulsar **Deploy** y conectar tu dominio.

La configuración también está en [`hostinger.json`](hostinger.json).

### Error "Internal Server Error" (500)

La causa más común es **no haber configurado las variables de entorno de Supabase** en hPanel, o no haber hecho **Redeploy** después de añadirlas.

1. Ve a tu sitio en hPanel → **Deployments** → **Environment variables**
2. Añade las 3 variables (usa tu URL real de Hostinger como `NEXT_PUBLIC_SITE_URL`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://sandybrown-pigeon-607893.hostingersite.com
```

3. Pulsa **Redeploy** (obligatorio tras cambiar variables o actualizar código desde GitHub)
4. Revisa los logs en **Deployments** si sigue fallando

Obtén las credenciales en: [supabase.com/dashboard](https://supabase.com/dashboard) → tu proyecto → **Settings → API** → `Project URL` y `anon public` key.

En Supabase → **Authentication → URL Configuration**, añade también:

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

La web y la app móvil comparten el **mismo proyecto Supabase**. Los usuarios registrados en la web pueden iniciar sesión en la app con las mismas credenciales. La web actúa como canal principal de registro y landing; dueños de canchas (`court_owner`, `court_staff`) usan el portal `/admin` en web (bloqueados en la app móvil).

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
| Supabase | [supabase.com/docs](https://supabase.com/docs) |
| Supabase + Next.js | [supabase.com/docs/guides/auth/server-side/nextjs](https://supabase.com/docs/guides/auth/server-side/nextjs) |
| Recharts | [recharts.org](https://recharts.org) |
| Hostinger Node.js | [hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/) |

---

## Licencia

Proyecto privado — Elite Forge.
