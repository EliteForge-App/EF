import { Logo } from '@/components/logo'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6">
          <Logo />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="ef-split-accent" aria-hidden />
            <div className="p-6 sm:p-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
