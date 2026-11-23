export const STATUS_BUILD = {
  WISHLIST: { label: 'Wishlist', cls: 'bg-sky-500/15 text-sky-300 border-sky-400/30' },
  FARMANDO: { label: 'Farmando', cls: 'bg-amber-500/15 text-amber-300 border-amber-400/30' },
  PRONTO: { label: 'Pronto', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' },
}

export const STATUS_OPTIONS = Object.entries(STATUS_BUILD).map(([value, v]) => ({ value, label: v.label }))
