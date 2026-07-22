'use client'

import { register } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const trimmedName = fullName.trim()

    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.')
      setIsLoading(false)
      return
    }

    if (!EMAIL_REGEX.test(email)) {
      setError('Introduce un correo electrónico válido.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    try {
      await register({
        name: trimmedName,
        email: email.trim().toLowerCase(),
        password,
      })
      router.push('/auth/confirmed')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? 'Este correo ya está registrado. Usa otro o contacta soporte.'
            : err.message,
        )
      } else {
        setError(
          'No se pudo conectar con el servidor. ¿Está el backend activo en el puerto 3000?',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-panel">
      <div className="mb-8 text-center">
        <p className="font-heading text-xs font-medium uppercase tracking-[0.3em] text-primary">
          Elite Forge
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold italic uppercase tracking-tight text-foreground">
          Crea tu cuenta
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Empieza tu camino del amateur al pro
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Juan Pérez"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
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

        <div className="space-y-2">
          <Label htmlFor="repeatPassword">Repite la contraseña</Label>
          <Input
            id="repeatPassword"
            type="password"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-2">
          <SocialAuthButtons />
          <Button
            type="submit"
            className="h-11 min-w-0 flex-1 font-heading font-semibold uppercase tracking-wide"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Administras una cancha?{' '}
        <Link
          href="/admin/login"
          className="font-medium text-primary hover:underline"
        >
          Acceder al dashboard
        </Link>
      </p>
    </div>
  )
}
