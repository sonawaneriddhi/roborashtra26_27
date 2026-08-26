export default function SchematicCallout({ code, label, detail, side = 'left', className = '' }) {
  const align = side === 'left' ? 'items-end text-right' : 'items-start text-left'
  return (
    <div className={`hidden lg:flex flex-col ${align} gap-1 ${className}`}>
      <span className="font-mono text-[11px] tracking-widest2 text-amber">{code}</span>
      <span className="font-display text-sm text-ink">{label}</span>
      <span className="font-mono text-[11px] text-slate max-w-[16ch]">{detail}</span>
    </div>
  )
}
