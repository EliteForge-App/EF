import Image from 'next/image'

/** Solo imagen. El enlace lo pone el padre (`Link`) para no anidar `<a>`. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/elite-forge-logo.png"
        alt="Elite Forge"
        width={200}
        height={64}
        className="h-12 w-auto object-contain sm:h-14"
        priority
      />
    </span>
  )
}
