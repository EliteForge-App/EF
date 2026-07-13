export function AdminPageHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-8">
      <h1 className="font-heading text-3xl font-bold italic uppercase tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
