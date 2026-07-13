import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-bold italic uppercase tracking-tight text-foreground">
        Algo salió mal
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {params?.error
          ? `Error: ${params.error}`
          : 'Ocurrió un error inesperado durante la autenticación.'}
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Button
          render={<Link href="/auth/sign-up" />}
          className="font-heading font-semibold uppercase tracking-wide"
        >
          Crear cuenta de nuevo
        </Button>
        <Button
          render={<Link href="/" />}
          variant="outline"
          className="font-heading font-medium uppercase tracking-wide"
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}
