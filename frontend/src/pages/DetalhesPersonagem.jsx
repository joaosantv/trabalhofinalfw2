import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Pencil, Shield, Sword, Target, Trash2 } from 'lucide-react'
import api from '../services/api'
import Alerta from '../components/Alerta'
import Carregando, { IndicadorCarregamento } from '../components/Carregando'
import { Estrelas, RetratoPersonagem, SeloStatus } from '../components/CartaoPersonagem'
import IconeElemento from '../components/IconeElemento'
import { parseApiError } from '../utils/errors'

export default function DetalhesPersonagem() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [personagem, setPersonagem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get(`/personagens/${id}`)
        if (active) setPersonagem(data)
      } catch (err) {
        if (active) setError(parseApiError(err).message)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    setError('')
    try {
      await api.delete(`/personagens/${id}`)
      navigate('/', { replace: true })
    } catch (err) {
      setError(parseApiError(err).message)
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  if (loading) {
    return <Carregando label="Carregando detalhes da build..." />
  }

  if (!personagem) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link to="/" className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Painel Principal
        </Link>
        <Alerta message={error || 'Personagem não encontrado.'} />
      </div>
    )
  }

  const gold = personagem.raridade === 5
  const cor = personagem.elemento?.corHex || '#E2C16B'
  const nivelPct = Math.min(100, Math.max(0, Math.round(((personagem.nivel || 1) / 90) * 100)))

  return (
    <div className="animar-entrada mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <div className="flex items-center gap-2">
          <Link to={`/personagens/editar/${personagem.id}`} className="btn btn-gold">
            <Pencil className="h-4 w-4" />
            Editar Build
          </Link>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            disabled={deleting}
            className="btn btn-danger"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>
        </div>
      </div>

      <Alerta message={error} onClose={() => setError('')} />

      {confirmingDelete && (
        <div className="glass flex flex-col gap-3 border-red-400/45 bg-red-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-100">
            Tem certeza que deseja excluir a build de <strong>{personagem.nome}</strong>? Essa ação não pode ser
            desfeita.
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
              className="btn btn-ghost"
            >
              Cancelar
            </button>
            <button type="button" onClick={handleDelete} disabled={deleting} className="btn btn-danger">
              {deleting ? (
                <>
                  <IndicadorCarregamento className="h-4 w-4 !text-red-200" />
                  Excluindo...
                </>
              ) : (
                'Confirmar exclusão'
              )}
            </button>
          </div>
        </div>
      )}

      <article className={`glass ${gold ? 'glass-gold' : 'glass-silver'} moldura-ornamental overflow-hidden`}>
        {/* Cabecalho do personagem */}
        <div
          className="relative grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-[215px_1fr] md:items-center"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 25%, ${cor}2A 0%, transparent 56%), linear-gradient(125deg, ${cor}18 0%, transparent 62%)`,
          }}
        >
          <IconeElemento
            nome={personagem.elemento?.nome}
            className="pointer-events-none absolute -right-4 -top-4 h-48 w-48 opacity-[0.07]"
            style={{ color: cor }}
          />

          <div
            className="relative z-10 overflow-hidden rounded-xl border-2 p-1"
            style={{
              borderColor: gold ? 'var(--ouro-borda)' : 'var(--prata-borda)',
              backgroundColor: 'rgba(9, 12, 23, 0.6)',
              boxShadow: `0 0 28px -10px ${cor}66`,
            }}
          >
            <RetratoPersonagem
              nome={personagem.nome}
              imagemUrl={personagem.imagemUrl}
              corHex={cor}
              elementoNome={personagem.elemento?.nome}
              className="h-52 w-full rounded-lg md:h-56"
            />
          </div>

          <div className="relative z-10 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase"
                  style={{ color: cor, borderColor: `${cor}77`, backgroundColor: `${cor}18` }}
                >
                  <IconeElemento nome={personagem.elemento?.nome} className="h-3.5 w-3.5" />
                  {personagem.elemento?.nome}
                </span>
                <SeloStatus status={personagem.statusBuild} />
              </div>

              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-[var(--texto-mutado)]">
                  Detalhes da Build
                </p>
                <h1
                  className={`font-display mt-1 text-3xl font-bold tracking-wide sm:text-4xl ${gold ? 'text-gold' : 'text-silver'}`}
                >
                  {personagem.nome}
                </h1>
              </div>
            </div>

            <div className="space-y-4 border-t border-[var(--borda-sutil)] pt-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs tracking-wider uppercase text-[var(--texto-mutado)]">Raridade</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Estrelas count={personagem.raridade} />
                    <span className="font-mono-tabular text-xs text-[var(--texto-secundario)]">
                      {personagem.raridade}★
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-wider uppercase text-[var(--texto-mutado)]">Nível Atual</p>
                  <p className="font-mono-tabular mt-1 text-lg font-semibold text-[var(--texto-primario)]">
                    {personagem.nivel}
                    <span className="text-xs font-normal text-[var(--texto-mutado)]"> / 90</span>
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs tracking-wider uppercase text-[var(--texto-mutado)]">Registro</p>
                  <p className="font-mono-tabular mt-1 text-sm font-medium text-[var(--texto-secundario)]">
                    #{String(personagem.id).padStart(3, '0')}
                  </p>
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--borda-sutil)] bg-black/30">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${nivelPct}%`,
                    background: `linear-gradient(90deg, ${cor}88, ${cor})`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detalhes da build */}
        <div className="grid grid-cols-1 divide-y divide-[var(--borda-sutil)] border-t border-[var(--borda-sutil)] md:grid-cols-2 md:divide-x md:divide-y-0">
          <div className="flex items-start gap-3.5 bg-[var(--bg-superficie)]/55 p-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ouro-borda)] bg-gold/10 text-gold">
              <Sword className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-[var(--texto-mutado)]">Arma Equipada</p>
              <p className="mt-1.5 text-base font-semibold text-[var(--texto-primario)]">{personagem.armaEquipada}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-[var(--bg-superficie)]/55 p-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ouro-borda)] bg-gold/10 text-gold">
              <Shield className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-[var(--texto-mutado)]">
                Conjunto de Artefatos
              </p>
              <p className="mt-1.5 text-base font-semibold text-[var(--texto-primario)]">
                {personagem.conjuntoArtefatos}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3.5 border-t border-[var(--borda-sutil)] bg-[var(--bg-superficie-elevada)]/50 p-6">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ouro-borda)] bg-gold/10 text-gold">
            <Target className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-[var(--texto-mutado)]">
              Metas de Atributos (Status Alvo)
            </p>
            <p className="font-mono-tabular mt-1.5 text-sm font-medium leading-relaxed text-[var(--texto-primario)] sm:text-base">
              {personagem.statusAlvo}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 border-t border-[var(--borda-sutil)] p-6">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--borda-sutil)] bg-white/[0.04] text-[var(--texto-secundario)]">
            <FileText className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-[var(--texto-mutado)]">Observações</p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--texto-secundario)]">
              {personagem.observacoes || 'Nenhuma observação cadastrada para esta build.'}
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}
