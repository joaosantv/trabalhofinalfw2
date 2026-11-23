import { AlertCircle, X } from 'lucide-react'

export default function Alerta({ message, onClose, type = 'error' }) {
  if (!message) return null
  const styles =
    type === 'error'
      ? 'border-red-400/40 bg-red-500/10 text-red-200'
      : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'

  return (
    <div role="alert" className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Fechar alerta" className="opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
