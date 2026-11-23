import { Loader2 } from 'lucide-react'
import { EmblemaMarca } from './BarraNavegacao'

export function IndicadorCarregamento({ className = 'h-5 w-5' }) {
  return <Loader2 className={`${className} animate-spin text-gold`} aria-hidden="true" />
}

export default function Carregando({ label = 'Carregando...' }) {
  return (
    <div
      className="glass moldura-ornamental flex flex-col items-center justify-center gap-4 py-16 text-sm text-[var(--texto-secundario)]"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold border-r-gold/30" />
        <span className="absolute inset-2 rounded-full border border-[var(--borda-sutil)]" />
        <EmblemaMarca className="h-5 w-5 text-gold" />
      </div>
      <span className="tracking-wide text-[var(--texto-primario)]">{label}</span>
    </div>
  )
}
