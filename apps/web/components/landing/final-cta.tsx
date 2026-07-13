import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

export function FinalCta() {
  return (
    <section className="border-y border-border bg-secondary/20">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-heading text-3xl font-bold italic uppercase tracking-tight text-foreground text-balance sm:text-5xl">
          ¿Listo para forjar tu legado?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Únete a miles de jugadores que ya están transformando su nivel amateur
          en rendimiento profesional.
        </p>
        <Button
          render={<Link href="/auth/sign-up" />}
          size="lg"
          className="mt-8 h-13 px-10 font-heading text-base font-semibold uppercase tracking-wide"
        >
          Crea tu cuenta gratis
        </Button>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Logo />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Elite Forge. Todos los derechos
          reservados.
          {process.env.NEXT_PUBLIC_BUILD_ID && (
            <span className="ml-2 opacity-50">
              build {process.env.NEXT_PUBLIC_BUILD_ID.slice(0, 10)}
            </span>
          )}
        </p>
      </div>
    </footer>
  )
}
