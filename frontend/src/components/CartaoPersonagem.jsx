import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Shield, Star, Sword } from 'lucide-react'
import { STATUS_BUILD } from '../utils/constants'
import IconeElemento from './IconeElemento'

export function Estrelas({ count }) {
  const gold = count === 5
  return (
    <span
      className={`font-mono-tabular inline-flex items-center gap-0.5 ${gold ? 'text-gold' : 'text-silver'}`}
      style={{ filter: gold ? 'drop-shadow(0 0 6px rgba(226, 193, 107, 0.38))' : 'none' }}
      aria-label={`${count} estrelas`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-current" />
      ))}
    </span>
  )
}

export function SeloStatus({ status }) {
  const s = STATUS_BUILD[status] || {
    label: status,
    cls: 'bg-white/5 text-[var(--texto-secundario)] border-[var(--borda-sutil)]',
  }
  return (
    <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase ${s.cls}`}>
      {s.label}
    </span>
  )
}

// Mostra a imagem do personagem ou um card com a inicial se nao tiver foto
export function RetratoPersonagem({
  nome,
  imagemUrl,
  corHex = '#E2C16B',
  elementoNome,
  className = 'h-48 w-full',
}) {
  const [falhou, setFalhou] = useState(false)
  const inicial = (nome?.trim()?.[0] || '?').toUpperCase()
  const mostrarImagem = Boolean(imagemUrl) && !falhou

  return (
    <div
      className={`relative overflow-hidden bg-[var(--bg-superficie-elevada)] ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 72% 22%, ${corHex}38 0%, transparent 56%), radial-gradient(circle at 22% 85%, ${corHex}1A 0%, transparent 50%), linear-gradient(155deg, ${corHex}22 0%, #0b0f1d 82%)`,
      }}
    >
      {mostrarImagem ? (
        <img
          src={imagemUrl}
          alt={nome}
          loading="lazy"
          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
          onError={() => setFalhou(true)}
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          <svg
            viewBox="0 0 180 180"
            className="pointer-events-none absolute h-40 w-40 opacity-35 transition duration-700 group-hover:rotate-12"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="90" cy="90" r="64" stroke={corHex} strokeWidth="0.9" strokeDasharray="4 4" />
            <circle cx="90" cy="90" r="46" stroke={corHex} strokeWidth="0.7" opacity="0.55" />
            <rect
              x="90"
              y="26"
              width="90"
              height="90"
              transform="rotate(45 90 26)"
              stroke={corHex}
              strokeWidth="1"
            />
          </svg>

          {elementoNome && (
            <IconeElemento
              nome={elementoNome}
              className="pointer-events-none absolute right-4 bottom-4 h-12 w-12 opacity-15"
              style={{ color: corHex }}
            />
          )}

          <div
            className="relative z-10 flex h-18 w-18 items-center justify-center rounded-full border-2 backdrop-blur-sm"
            style={{
              borderColor: `${corHex}66`,
              backgroundColor: 'rgba(9, 12, 23, 0.65)',
              boxShadow: `inset 0 0 0 4px rgba(9, 12, 23, 0.65), inset 0 0 0 5px ${corHex}33, 0 0 30px -6px ${corHex}99`,
            }}
          >
            <span className="font-display select-none text-3xl font-bold" style={{ color: corHex }}>
              {inicial}
            </span>
          </div>
        </div>
      )}

      {/* Degrade na base da imagem */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0e1322] via-[#0e1322]/55 to-transparent" />
    </div>
  )
}

export default function CartaoPersonagem({ personagem }) {
  const gold = personagem.raridade === 5
  const cor = personagem.elemento?.corHex || '#E2C16B'
  const nivelPct = Math.min(100, Math.max(0, Math.round(((personagem.nivel || 1) / 90) * 100)))

  return (
    <Link
      to={`/personagens/${personagem.id}`}
      style={{ '--el-cor': cor }}
      className={`glass ${gold ? 'glass-gold' : 'glass-silver'} carta-personagem animar-entrada group flex flex-col overflow-hidden`}
    >
      <div className="relative">
        <RetratoPersonagem
          nome={personagem.nome}
          imagemUrl={personagem.imagemUrl}
          corHex={cor}
          elementoNome={personagem.elemento?.nome}
          className="h-48 w-full"
        />

        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md"
          style={{
            color: cor,
            borderColor: `${cor}77`,
            backgroundColor: 'rgba(9, 12, 23, 0.84)',
          }}
        >
          <IconeElemento nome={personagem.elemento?.nome} className="h-3.5 w-3.5" />
          {personagem.elemento?.nome}
        </span>

        <span className="font-mono-tabular absolute bottom-3 right-3 rounded-md border border-[var(--borda-ativa)] bg-[#090c17]/90 px-2.5 py-0.5 text-xs font-semibold text-[var(--texto-primario)] backdrop-blur-md">
          NV {personagem.nivel}
        </span>
      </div>

      {/* Barra de nivel */}
      <div className="h-[2.5px] w-full bg-white/[0.06]">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${nivelPct}%`,
            background: `linear-gradient(90deg, ${cor}88, ${cor})`,
          }}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-display truncate text-lg font-bold tracking-wide ${gold ? 'text-gold' : 'text-silver'}`}
            >
              {personagem.nome}
            </h3>
            <Estrelas count={personagem.raridade} />
          </div>

          <div className="space-y-1.5 text-xs text-[var(--texto-secundario)]">
            <div className="flex items-center gap-2">
              <Sword className="h-3.5 w-3.5 shrink-0 text-gold/70" />
              <span className="truncate font-medium text-[var(--texto-primario)]/95">
                {personagem.armaEquipada}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 shrink-0 text-[var(--texto-mutado)]" />
              <span className="truncate">{personagem.conjuntoArtefatos}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--borda-sutil)] pt-3">
          <SeloStatus status={personagem.statusBuild} />
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--texto-mutado)] transition group-hover:text-gold">
            Abrir ficha
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
