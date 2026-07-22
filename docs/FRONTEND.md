# Elite Forge — Documentación Frontend (Mobile)

Registro técnico de la implementación del frontend móvil en el monorepo `EF`. Para producto y negocio, ver [ELITE_FORGE.md](./ELITE_FORGE.md).

---

## Overview

El frontend vive en `apps/mobile/` y es una aplicación **React Native** generada con **Ignite CLI**, extendida con **Tamagui** como sistema de diseño y componentes UI propios bajo `app/components/ui/`.

### Estado actual

| Área | Estado |
|------|--------|
| Pantalla de **Login** | Implementada + conectada al API Gateway |
| Pantalla **Feed** (red social) | Implementada (UI mock, sin backend) |
| Pantalla de **Register** (placeholder) | En stack; registro real vía portal web externo |
| **Backend / auth real** | Login conectado al API Gateway (`POST /api/auth/login`) |
| **Feed backend** | No implementado — datos mock en `app/data/mockFeedPosts.ts` |
| **Expo Dev Client** | Configurado para Android/iOS |

### Flujo de arranque

```
app.tsx
  ├── TamaguiProvider (tamagui.config.ts + tokens Elite Forge)
  ├── AuthProvider
  ├── SafeAreaProvider + KeyboardProvider
  └── AppNavigator
        ├── No autenticado → Login / Register
        └── Autenticado     → Feed / Demo
```

La pantalla inicial para usuarios autenticados es **Feed** (`FeedScreen`). Sin sesión → **Login**.

---

## Stack tecnológico

| Capa | Tecnología | Versión / notas |
|------|------------|-----------------|
| Runtime | React Native | 0.83.6 |
| UI library | React | 19.2.0 |
| Framework móvil | Expo | ~55.0.27 |
| Dev build | expo-dev-client | Requiere build nativo (no Expo Go) |
| Boilerplate | Ignite CLI | Estructura base del proyecto |
| Design system | Tamagui | ^2.4.0 |
| Navegación | React Navigation | Native Stack v7 |
| Animaciones | react-native-reanimated | 4.2.1 |
| Gestos | react-native-gesture-handler | ~2.30.0 |
| Teclado | react-native-keyboard-controller | 1.20.7 |
| i18n | i18next + react-i18next | 7 idiomas |
| Persistencia local | react-native-mmkv | 3.3.3 |
| Fuentes | @expo-google-fonts/space-grotesk | — |
| Web (opcional) | react-native-web | ~0.21.0 |
| Lenguaje | TypeScript | ~5.9.2 |

---

## Dependencias principales

### Producción (`apps/mobile/package.json`)

| Paquete | Uso en Elite Forge |
|---------|-------------------|
| `expo`, `expo-dev-client` | Entorno, builds nativos, Metro |
| `tamagui`, `@tamagui/config`, `@tamagui/babel-plugin`, `@tamagui/metro-plugin` | Tema, componentes, compilación |
| `@react-navigation/native`, `native-stack`, `bottom-tabs` | Navegación entre pantallas |
| `react-native-reanimated` | Animaciones de hover/press en login |
| `react-native-safe-area-context` | Insets y layout responsivo |
| `react-native-screens` | Optimización de navegación nativa |
| `react-native-edge-to-edge` | Pantalla edge-to-edge |
| `i18next`, `react-i18next`, `expo-localization` | Traducciones |
| `apisauce` | Cliente HTTP (login + demo podcast) |
| `date-fns` | Formateo de fechas |
| `react-native-drawer-layout` | Drawer lateral del Feed (menú) |

### Desarrollo

| Paquete | Uso |
|---------|-----|
| `typescript` | Tipado estático |
| `eslint`, `eslint-config-expo`, `prettier` | Lint y formato |
| `jest`, `jest-expo`, `@testing-library/react-native` | Tests |
| `reactotron-react-native` | Debug en desarrollo |

---

## Estructura relevante

```
apps/mobile/
├── app/
│   ├── app.tsx                    # Entry: providers + navigator
│   ├── components/ui/           # Componentes Elite Forge reutilizables
│   ├── hooks/
│   │   ├── useResponsiveLayout.ts
│   │   └── useInteractiveMotion.ts
│   ├── data/
│   │   └── mockFeedPosts.ts       # Posts mock del Feed (sin backend)
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── feed/
│   │       ├── FeedScreen.tsx
│   │       └── components/        # FeedNavbar, FeedDrawer, FeedPostCard, etc.
│   ├── navigators/AppNavigator.tsx
│   ├── theme/
│   │   ├── eliteForgeColors.ts
│   │   └── context.tsx
│   └── i18n/                      # en, es, fr, ja, ko, hi, ar
├── assets/images/
│   └── elite-forge-logo.png       # Logo en app (RGBA, transparente)
├── tamagui.config.ts              # Tokens de color Elite Forge
└── package.json
```

**Assets compartidos con documentación:**

| Ruta | Descripción |
|------|-------------|
| `docs/assets/elite-forge-logo.png` | Fuente oficial del logo |
| `apps/mobile/assets/images/elite-forge-logo.png` | Copia usada por la app |

---

## Sistema de diseño

### Paleta (`eliteForgeColors.ts` + `tamagui.config.ts`)

| Token | Hex | Uso |
|-------|-----|-----|
| `emerald` | `#00CEC8` | Acentos izquierda, botón primario, enlaces |
| `orange` | `#FF8C00` | Acentos derecha, barra del formulario |
| `carbon` | `#424242` | Fondo principal de pantallas auth |
| `white` | `#FFFFFF` | Texto |
| `carbonElevated` | `#363636` | Tarjeta del formulario de login |
| `carbonBorder` | `#555555` | Bordes |
| `carbonInput` | `#2e2e2e` | Fondo de inputs |
| `mutedSurface` | `#9C9C9C` | Token reservado (no usado como fondo global) |

### Split-color en login

La tarjeta de login incluye una franja superior de 3px: mitad esmeralda, mitad naranja, reflejando la identidad bicolor del producto.

### Logo

- Componente: `EliteForgeLogo` (`app/components/ui/Logo.tsx`)
- Render con `Image` de **react-native** (no Tamagui `Image` con `require()`)
- PNG con **fondo transparente** (canal alpha)
- Tamaño responsivo vía `useResponsiveLayout().logoWidth` (62–68% del ancho, máx. 280–320px)

---

## Componentes UI implementados

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `Button` | `Button.tsx` | Variantes: primary, secondary, outline, ghost. Animación press/hover |
| `Input` | `Input.tsx` | Label, campo, toggle ojo (mostrar/ocultar) en contraseña. Focus/hover animado |
| `SocialButton` | `SocialButton.tsx` | Google y Facebook. `iconOnly` minimalista (40×40); modos `compact` / full |
| `AuthFormCard` | `AuthFormCard.tsx` | Contenedor del formulario con barra bicolor y hover |
| `EliteForgeLogo` | `Logo.tsx` | Logo de marca responsivo |
| `Divider` | `Divider.tsx` | Separador con etiqueta ("o continuar con") |
| `LinkText` | `LinkText.tsx` | Texto + enlace (ej. crear cuenta) |
| `Card`, `Navbar`, `Toggle` | — | Base reutilizable / demo |

Export centralizado: `app/components/ui/index.ts`

---

## Pantalla de Login — implementación

**Archivo:** `app/screens/auth/LoginScreen.tsx`

### Layout

- Fondo `#424242` (Gris Carbón)
- `KeyboardAvoidingView` + `ScrollView` responsivo
- `useResponsiveLayout()` para padding, gaps y ancho máximo
- Sin título "Login" — solo logo ampliado + subtítulo

### Contenido (de arriba a abajo)

1. **Logo Elite Forge** (grande, centrado)
2. **Subtítulo** i18n (`loginScreen:subtitle`)
3. **AuthFormCard** con:
   - Input usuario
   - Input contraseña (secure + icono ojo)
   - Botón **Iniciar sesión** solo a ancho completo
   - Fila centrada: **Crear cuenta** + iconos Facebook/Gmail a la derecha
   - `AuthFormCard` a ancho completo (padding ~4%)

### Comportamiento

- Login real vía `api.login()`; token en `AuthContext` (MMKV) → redirección automática a **Feed**
- `handleCreateAccount` abre `Config.SIGN_UP_URL` → `apps/web` `/auth/sign-up` (NestJS/Prisma)
- Botones Gmail/Facebook (solo UI)
- **Bypass UI (`__DEV__`)**: botón «Entrar sin backend (UI)» guarda un token fake en MMKV y abre **Feed** sin API

---

## Pantalla Feed — red social (UI)

**Archivo principal:** `app/screens/feed/FeedScreen.tsx`

Destino post-login. Estilo tipo **Facebook**: publicaciones de jugadores, anuncios Elite Forge, composer superior y acciones sociales (solo UI).

### Layout

- `react-native-drawer-layout` — menú lateral (~82% ancho)
- `FeedNavbar` — barra moderna bicolor; logo grande que **se colapsa al scroll** (58→34)
- `Animated.FlatList` + `useSharedValue` / `useAnimatedScrollHandler` (Reanimated)
- Fondo `#424242`

### Componentes del Feed

| Componente | Descripción |
|------------|-------------|
| `FeedNavbar` | Navbar abatible; logo animado; menú + avatar |
| `FeedDrawer` | Perfil, Grupos, Partidos, Reservas + logout (iconos Ionicons) |
| `FeedComposer` | Composer con iconos modernos + margen inferior; abre modal |
| `FeedComposeModal` | Popup estilo Facebook/X para crear publicación (UI stub) |
| `FeedShareSheet` | Bottom sheet al pulsar Compartir en un post |
| `FeedPostCard` | Publicación con acciones (heart / chat / share) en iconos |
| `FeedAvatar` | Avatar circular con iniciales y animación press |
| `mockFeedPosts.ts` | Datos mock (jugadores + anuncios Elite Forge) |

### Drawer — accesos futuros

| Ítem | Estado |
|------|--------|
| Perfil | Alert “Próximamente” |
| Grupos | Alert “Próximamente” |
| Partidos | Alert “Próximamente” |
| Reservas | Alert “Próximamente” |
| Cerrar sesión | Funcional (`logout()` → Login) |

### i18n

Claves `feedScreen:*` y `feedDrawer:*` en los 7 idiomas.

---

## Animaciones e interacción

**Hook:** `app/hooks/useInteractiveMotion.ts`  
**Motor:** `react-native-reanimated` (spring: damping 20, stiffness 320)

| Preset | Elemento | Hover (web) | Press / focus |
|--------|----------|-------------|---------------|
| `button` | Sign in | Escala +2%, sube 2px | Escala 97% |
| `social` | Gmail / Facebook | Escala +3%, sube 2px | Escala 96% + cambio de color |
| `card` | AuthFormCard | Sube 3px, borde esmeralda | — |
| `input` | Campos usuario/contraseña | Escala +1.2%, borde esmeralda | Igual al enfocar |

> En **Android/iOS** no hay hover con ratón; el feedback es al **presionar** y al **enfocar** inputs. En **web** también aplica hover.

---

## Responsividad

**Hook:** `app/hooks/useResponsiveLayout.ts`

| Parámetro | Lógica |
|-----------|--------|
| `isSmallScreen` | Altura &lt; 700px o ancho &lt; 360px |
| `isTablet` | Ancho ≥ 768px |
| `horizontalPadding` | max(16, 6% del ancho) |
| `contentMaxWidth` | Hasta 440px (480 en tablet) |
| `logoWidth` | 62–68% del ancho, tope 280–320px |
| `sectionGap` | 14 / 22 / 28 según tamaño |
| Safe areas | `useSafeAreaInsets()` |

**Regla Cursor:** `.cursor/rules/mobile-responsive-ui.mdc` — toda pantalla nueva debe seguir este patrón.

---

## Internacionalización (i18n)

Claves relevantes del login en `app/i18n/*.ts`:

| Clave | Ejemplo (es) |
|-------|----------------|
| `loginScreen:subtitle` | Subtítulo de bienvenida |
| `loginScreen:usernameFieldLabel` | Usuario |
| `loginScreen:passwordFieldLabel` | Contraseña |
| `loginScreen:signInButton` | Iniciar sesión |
| `loginScreen:googleButton` | Continuar con Gmail (accesibilidad) |
| `loginScreen:googleButtonShort` | Gmail (UI compacta) |
| `loginScreen:facebookButton` | Continuar con Facebook |
| `loginScreen:facebookButtonShort` | Facebook |
| `loginScreen:uiPreviewButton` | Entrar sin backend (UI) — solo `__DEV__` |

Idiomas: `en`, `es`, `fr`, `ja`, `ko`, `hi`, `ar`.

---

## Registro de cambios (sesión de implementación)

### 2026-07-17 — Fix Android monorepo (react-native-worklets)

- [x] Causa: `android/build/generated/autolinking/autolinking.json` apuntaba a `apps/mobile/node_modules/*` (hoist npm workspaces → raíz)
- [x] `android/settings.gradle` y `app/build.gradle` resuelven Node desde `apps/mobile` (paquete workspace)
- [x] `react-native.config.js` + `experiments.autolinkingModuleResolution`
- [x] Eliminado `apps/mobile/package-lock.json` / `node_modules` anidados
- [x] Workaround Gradle 9 + foojay 0.5.0 (`scripts/patch-rn-gradle-foojay.js` + `postinstall`)
- [x] `assembleDebug` OK (`npx expo run:android`)

### 2026-07-17 — Registro web NestJS (`apps/web`)

- [x] `SIGN_UP_URL` en `config.dev.ts` usa el mismo host que la API (`getDevApiHost`) → `http://<host>:5173/auth/sign-up`
- [x] `RegisterScreen` abre el formulario web y vuelve al login (ya no es placeholder con solo “atrás”)
- [x] `openLinkInBrowser` siempre intenta `Linking.openURL` (fix Android)
- [x] `SIGN_UP_URL` en `config.prod.ts` deja Hostinger (Supabase) y apunta a `apps/web`
- [x] `DEV_LAN_HOST` según red local del desarrollador

### Infraestructura y base

- [x] Monorepo con app móvil Ignite en `apps/mobile/`
- [x] Integración Tamagui + tokens `eliteForgeColors` en `tamagui.config.ts`
- [x] Navegación auth: `Login` → `Register` en `AppNavigator`
- [x] Hook `useResponsiveLayout` para Android/iOS
- [x] Regla Cursor `mobile-responsive-ui.mdc`

### Pantalla Login

- [x] UI completa: logo, subtítulo, formulario, redes sociales
- [x] Fondo global `#424242` (revertido desde gris `#9C9C9C`)
- [x] Tarjeta elevada `#363636` con franja bicolor superior
- [x] Inputs con labels, placeholders i18n y toggle de contraseña
- [x] Toggle contraseña con icono Ionicons (`eye-outline` / `eye-off-outline`) centrado en la caja
- [x] Bypass `__DEV__` «Entrar sin backend (UI)» en `LoginScreen` para previsualizar Feed sin API
- [x] Login: «Iniciar sesión» solo a ancho completo; Facebook/Gmail a la derecha de «Crear cuenta»
- [x] Enlace "Crear cuenta" → `Config.SIGN_UP_URL` (`apps/web` `/auth/sign-up` vía `openLinkInBrowser`)
- [x] Botones Gmail/Facebook (solo UI)
- [x] `handleLogin` conectado al API Gateway — `api.login()`, token en `AuthContext` (MMKV)
- [x] `handleCreateAccount` abre registro web (`apps/web`); en dev usa el mismo host que la API
- [x] Validación email/contraseña, errores i18n, estado de carga
- [x] `config.dev.ts` API `http://<host>:3000/api/` y sign-up `http://<host>:5173/auth/sign-up`
- [x] `SocialButton.iconOnly` (40×40) junto a «Crear cuenta»
- [x] Nuevo logo oficial en `docs/assets/` y `apps/mobile/assets/images/`
- [x] Documentación de composición en `ELITE_FORGE.md`
- [x] PNG con transparencia real (RGBA) — corrección de fondo negro aplanado al exportar
- [x] Eliminación del título "Login" — logo como protagonista visual
- [x] Aumento de tamaño del logo (62–68% ancho, máx. 280–320px)

### Botones sociales

- [x] Modo `compact`: icono + etiqueta corta (Gmail / Facebook)
- [x] Modo `iconOnly` para la fila de login
- [x] Claves i18n `*ButtonShort` para etiquetas compactas

### Animaciones

- [x] Hook `useInteractiveMotion` con presets
- [x] Animaciones en `Button`, `SocialButton`, `Input`
- [x] Componente `AuthFormCard` con hover en contenedor del login

### Feed (red social)

- [x] `FeedScreen` como destino post-login en `AppNavigator`
- [x] `FeedNavbar` interactivo con miniatura de perfil y menú
- [x] `FeedNavbar` sin texto "Feed" — solo logo Elite Forge centrado
- [x] `FeedMenuButton` (hamburguesa estándar) y nombre bajo avatar eliminado en navbar
- [x] `openProfile()` en `feedNavigation.ts` — alerta "Próximamente" al pulsar avatar
- [x] `FeedDrawer` con accesos futuros (Perfil, Grupos, Partidos, Reservas) y logout
- [x] `FeedComposer`, `FeedPostCard`, `FeedAvatar` — estilo Facebook
- [x] Mock data: publicaciones de jugadores + anuncios Elite Forge (`mockFeedPosts.ts`)
- [x] i18n `feedScreen` / `feedDrawer` (7 idiomas)
- [x] Sin backend — solo UI y datos locales
- [x] `FeedNavbar` colapsable al scroll (logo 58→34) + estilo más moderno
- [x] Composer con más margen inferior; emojis → Ionicons
- [x] `FeedComposeModal` y `FeedShareSheet` (popups estilo Facebook/X)
- [x] Acciones del post y drawer con iconos modernos (sin emojis)
- [x] `FeedComposeModal` compacto, anclado sobre el teclado

### Pendiente / fuera de alcance actual

- [ ] API real del Feed (publicaciones, likes, comentarios)
- [ ] Pantallas Perfil, Grupos, Partidos, Reservas
- [ ] Formulario completo de Register in-app
- [ ] OAuth real (Google / Facebook SDK)
- [ ] Eliminar o aislar pantallas demo de Ignite

### Desarrollo en dispositivo físico

- [x] `config.dev.ts` detecta emulador vs móvil real — LAN IP local en dispositivo, `10.0.2.2` en emulador Android

---

## Comandos de desarrollo

```bash
cd apps/mobile

# Metro bundler
npm start

# Compilar e instalar dev build Android
npm run android

# iOS (macOS)
npm run ios

# Web
npm run web

# Typecheck
npm run compile

# Lint
npm run lint:check
```

### Notas Android (Windows)

- El proyecto usa **Expo Dev Client**, no Expo Go.
- Puede requerir `apps/mobile/android/local.properties` con `sdk.dir`.
- En rutas largas de Windows, usar `npx expo start --clear` o `--active-arch-only` si falla el build.

---

## Mantenimiento de documentación

**Regla del proyecto:** todo cambio en `apps/mobile/` debe registrarse y actualizarse en este archivo (`docs/FRONTEND.md`). Ver `.cursor/rules/frontend-documentation.mdc`.

Al implementar algo nuevo:

1. Actualizar la sección correspondiente (componentes, pantallas, dependencias, etc.).
2. Añadir una entrada en **Registro de cambios** con `[x]`.
3. Ajustar **Overview / estado** si el alcance del frontend cambia.

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| [ELITE_FORGE.md](./ELITE_FORGE.md) | Producto, módulos, logo, negocio |
| [BACKEND.md](./BACKEND.md) | API, microservicios, base de datos |
| [README.md](../README.md) | Monorepo completo, backend, infra |
| `.cursor/rules/mobile-responsive-ui.mdc` | Estándares UI responsiva |

---

*Última actualización: Feed compose/share modals + login con redes a la derecha de crear cuenta.*
