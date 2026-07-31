'use client'

import { login } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAdminHomePath, isAdminRole } from '@/lib/admin/roles'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [devBypassEnabled, setDevBypassEnabled] = useState(false)
  const [devBypassLoading, setDevBypassLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const accessDenied = searchParams.get('error') === 'access_denied'

  useEffect(() => {
    let cancelled = false
    void fetch('/api/session/dev-bypass')
      .then((res) => res.json())
      .then((data: { enabled?: boolean }) => {
        if (!cancelled) setDevBypassEnabled(Boolean(data.enabled))
      })
      .catch(() => {
        if (!cancelled) setDevBypassEnabled(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await login({
        email: email.trim().toLowerCase(),
        password,
      })

      if (!isAdminRole(result.user.role)) {
        await fetch('/api/session/logout', { method: 'POST' })
        setError(
          'Esta cuenta no tiene acceso al portal de administración. Usa la app móvil o contacta soporte.',
        )
        return
      }

      await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: result.accessToken }),
      })

      router.push(getAdminHomePath(result.user.role))
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? 'Correo o contraseña incorrectos.'
            : err.message,
        )
      } else {
        setError('No se pudo conectar con el servidor.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDevBypass = async () => {
    setDevBypassLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/session/dev-bypass', { method: 'POST' })
      const data = (await res.json()) as {
        homePath?: string
        error?: string
      }
      if (!res.ok) {
        setError(data.error ?? 'No se pudo activar el modo UI.')
        return
      }
      router.push(data.homePath ?? '/admin/reservas')
      router.refresh()
    } catch {
      setError('No se pudo activar el modo UI.')
    } finally {
      setDevBypassLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Elite Forge Admin
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold italic uppercase tracking-tight text-foreground">
            Portal de gestión
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acceso para administradores de canchas y empresarios
          </p>
        </div>

        {accessDenied && (
          <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            No tienes permisos para acceder al portal de administración.
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            className="h-11 w-full font-heading font-semibold uppercase tracking-wide"
            disabled={isLoading || devBypassLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar al portal'}
          </Button>
        </form>

        {devBypassEnabled ? (
          <div className="mt-4 space-y-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              Modo desarrollo
            </p>
            <p className="text-sm text-muted-foreground">
              Entra sin backend para trabajar UI del dashboard (sesión mock
              Empresario + datos demo).
            </p>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full font-heading font-semibold uppercase tracking-wide"
              disabled={isLoading || devBypassLoading}
              onClick={() => void handleDevBypass()}
            >
              {devBypassLoading ? 'Entrando...' : 'Entrar modo UI (dev)'}
            </Button>
          </div>
        ) : null}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Aún no tienes cuenta?{' '}
          <Link
            href="/auth/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Regístrate
          </Link>
          {' · '}
          <Link href="/" className="font-medium text-primary hover:underline">
            Volver a la web pública
          </Link>
        </p>
      </div>
    </div>
  )
}
