import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Logo em SVG
export function EmblemaMarca({ className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 2L17.1 10.9L26 14L17.1 17.1L14 26L10.9 17.1L2 14L10.9 10.9L14 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="miter"
      />
      <path
        d="M14 7.5L15.8 12.2L20.5 14L15.8 15.8L14 20.5L12.2 15.8L7.5 14L12.2 12.2L14 7.5Z"
        fill="currentColor"
        fillOpacity="0.24"
      />
      <circle cx="14" cy="14" r="1.4" fill="currentColor" />
    </svg>
  )
}

export default function BarraNavegacao() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const inicial = (user?.nome?.trim()?.[0] || 'V').toUpperCase()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--borda-sutil)] bg-[#090c17]/85 backdrop-blur-md">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--ouro-borda)] to-transparent" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-7">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--ouro-borda)] bg-[var(--bg-superficie)] text-gold shadow-[0_0_18px_-6px_rgba(226,193,107,0.45)] transition group-hover:border-gold">
              <EmblemaMarca className="h-5 w-5" />
            </div>
            <div className="leading-none">
              <span className="font-display block text-sm font-bold tracking-[0.18em] text-[var(--texto-primario)] sm:text-base">
                BUILD<span className="text-gold">PLANNER</span>
              </span>
              <span className="hidden text-[10px] tracking-[0.22em] uppercase text-[var(--texto-mutado)] sm:block">
                Genshin Impact
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Navegação principal">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition ${
                  isActive
                    ? 'border border-[var(--ouro-borda)] bg-gold/10 text-gold'
                    : 'text-[var(--texto-secundario)] hover:bg-white/[0.05] hover:text-[var(--texto-primario)]'
                }`
              }
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Painel
            </NavLink>
            <NavLink
              to="/personagens/novo"
              className={({ isActive }) =>
                `relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition ${
                  isActive
                    ? 'border border-[var(--ouro-borda)] bg-gold/10 text-gold'
                    : 'text-[var(--texto-secundario)] hover:bg-white/[0.05] hover:text-[var(--texto-primario)]'
                }`
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Nova Build
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2.5 rounded-full border border-[var(--borda-sutil)] bg-[var(--bg-superficie)]/90 py-1 pl-1.5 pr-3.5 text-xs font-medium text-[var(--texto-secundario)] sm:flex">
            <span className="font-display flex h-6 w-6 items-center justify-center rounded-full border border-[var(--ouro-borda)] bg-gold/15 text-[11px] font-bold text-gold">
              {inicial}
            </span>
            <span className="max-w-[160px] truncate text-[var(--texto-primario)]">{user?.nome}</span>
          </div>
          <button type="button" onClick={handleLogout} className="btn btn-ghost text-xs" aria-label="Sair">
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
