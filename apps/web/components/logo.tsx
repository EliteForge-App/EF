import Image from 'next/image'
import Link from 'next/link'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/elite-forge-logo.png"
        alt="Elite Forge"
        width={200}
        height={64}
        className="h-12 w-auto object-contain sm:h-14"
        priority
      />
    </Link>
  )
}
