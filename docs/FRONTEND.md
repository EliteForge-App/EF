# Elite Forge — Documentación Frontend (Mobile)

Registro técnico de la implementación del frontend móvil en el monorepo `EF`. Para producto y negocio, ver [ELITE_FORGE.md](./ELITE_FORGE.md).

---

## Overview

El frontend vive en `apps/mobile/` y es una aplicación **React Native** generada con **Ignite CLI**, extendida con **Tamagui** como sistema de diseño y componentes UI propios bajo `app/components/ui/`.

### Estado actual

| Área | Estado |
|------|--------|
| Pantalla de **Login** (UI) | Implementada |
| Pantalla de **Register** (placeholder) | En stack; registro real vía portal web externo |
| **Backend / auth real** | Login conectado al API Gateway (`POST /api/auth/login`) |
| **Demo screens** (Ignite) | Presentes, no son parte del producto final |
| **Expo Dev Client** | Configurado para Android/iOS |

### Flujo de arranque

```
app.tsx
  ├── TamaguiProvider (tamagui.config.ts + tokens Elite Forge)
  ├── AuthProvider
  ├── SafeAreaProvider + KeyboardProvider
  └── AppNavigator
        ├── No autenticado → Login / Register
        └── Autenticado     → Welcome / Demo
```

La pantalla inicial para usuarios no autenticados es **Login** (`AppNavigator.tsx`).

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
| `react-native-mmkv` | Storage rápido |

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
│   ├── screens/auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
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
| `Input` | `Input.tsx` | Label, campo, toggle Ver/Ocultar en contraseña. Focus/hover animado |
| `SocialButton` | `SocialButton.tsx` | Google y Facebook. Modo `compact` para fila horizontal |
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
   - Input contraseña (secure + Ver/Ocultar)
   - Botón Sign in (sin lógica de backend)
   - Enlace a Register
4. **Divider** + botones sociales **Gmail** y **Facebook** en **una fila** (modo compact)

### Comportamiento intencional (solo UI)

- `onPress={() => undefined}` en Sign in y redes sociales
- Estado local `username` / `password` sin envío a API
- Navegación a `Register` funcional

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

Idiomas: `en`, `es`, `fr`, `ja`, `ko`, `hi`, `ar`.

---

## Registro de cambios (sesión de implementación)

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
- [x] Enlace "Crear cuenta" → `https://sandybrown-pigeon-607893.hostingersite.com/auth/sign-up` (`openLinkInBrowser`)
- [x] Botones Gmail/Facebook (solo UI)
- [x] `handleLogin` conectado al API Gateway — `api.login()`, token en `AuthContext` (MMKV)
- [x] `handleCreateAccount` abre registro web externo (Hostinger)
- [x] Validación email/contraseña, errores i18n, estado de carga
- [x] `config.dev.ts` apunta a `http://localhost:3000/api/` (Android emulator: `10.0.2.2`)

### Pantalla Login

- [x] Nuevo logo oficial en `docs/assets/` y `apps/mobile/assets/images/`
- [x] Documentación de composición en `ELITE_FORGE.md`
- [x] PNG con transparencia real (RGBA) — corrección de fondo negro aplanado al exportar
- [x] Limpieza de huecos en letras (ej. interior de la "O" en FORGE)
- [x] Eliminación del título "Login" — logo como protagonista visual
- [x] Aumento de tamaño del logo (62–68% ancho, máx. 280–320px)

### Botones sociales

- [x] Modo `compact`: icono + etiqueta corta (Gmail / Facebook)
- [x] Ambos en **una fila** (`XStack` con `flex: 1`)
- [x] Claves i18n `*ButtonShort` para etiquetas compactas

### Animaciones

- [x] Hook `useInteractiveMotion` con presets
- [x] Animaciones en `Button`, `SocialButton`, `Input`
- [x] Componente `AuthFormCard` con hover en contenedor del login

### Pendiente / fuera de alcance actual

- [ ] Conectar login con `auth-service` (backend NestJS)
- [ ] Formulario completo de Register
- [ ] OAuth real (Google / Facebook SDK)
- [ ] Pantallas post-login del producto (feed, perfil, grupos, etc.)
- [ ] Eliminar o aislar pantallas demo de Ignite

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

*Última actualización: login conectado al backend vía API Gateway.*
