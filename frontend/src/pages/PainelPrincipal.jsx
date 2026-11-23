import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, CheckCircle2, Hammer, Layers, Plus, RefreshCw, Search, X } from 'lucide-react'
import api from '../services/api'
import Alerta from '../components/Alerta'
import { EmblemaMarca } from '../components/BarraNavegacao'
import Carregando from '../components/Carregando'
import CartaoPersonagem from '../components/CartaoPersonagem'
import IconeElemento from '../components/IconeElemento'
import { STATUS_OPTIONS } from '../utils/constants'
import { parseApiError } from '../utils/errors'

export default function PainelPrincipal() {
  const [personagens, setPersonagens] = useState([])
  const [elementos, setElementos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [busca, setBusca] = useState('')
  const [elementoFiltro, setElementoFiltro] = useState('TODOS')
  const [statusFiltro, setStatusFiltro] = useState('TODOS')

  const carregarDados = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [persRes, elemRes] = await Promise.all([api.get('/personagens'), api.get('/elementos')])
      setPersonagens(Array.isArray(persRes.data) ? persRes.data : [])
      setElementos(Array.isArray(elemRes.data) ? elemRes.data : [])
    } catch (err) {
      setError(parseApiError(err).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const resumo = useMemo(() => {
    let prontos = 0
    let farmando = 0
    let wishlist = 0
    for (const p of personagens) {
      if (p.statusBuild === 'PRONTO') prontos++
      else if (p.statusBuild === 'FARMANDO') farmando++
      else if (p.statusBuild === 'WISHLIST') wishlist++
    }
    const taxaPronto = personagens.length > 0 ? Math.round((prontos / personagens.length) * 100) : 0
    return { total: personagens.length, prontos, farmando, wishlist, taxaPronto }
  }, [personagens])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return personagens.filter((p) => {
      if (termo && !p.nome?.toLowerCase().includes(termo)) return false
      if (elementoFiltro !== 'TODOS' && String(p.elemento?.id) !== String(elementoFiltro)) return false
      if (statusFiltro !== 'TODOS' && p.statusBuild !== statusFiltro) return false
      return true
    })
  }, [personagens, busca, elementoFiltro, statusFiltro])

  const temFiltroAtivo = busca.trim() !== '' || elementoFiltro !== 'TODOS' || statusFiltro !== 'TODOS'

  function limparFiltros() {
    setBusca('')
    setElementoFiltro('TODOS')
    setStatusFiltro('TODOS')
  }

  return (
    <div className="space-y-8">
      {/* Cabecalho */}
      <section className="glass glass-gold moldura-ornamental relative overflow-hidden p-6 sm:p-8">
        <EmblemaMarca className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 text-gold/[0.07]" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ouro-borda)] bg-gold/10 px-3 py-0.5 text-[11px] font-semibold tracking-widest uppercase text-gold">
              Planejador de Genshin Impact
            </div>
            <h1 className="font-display text-2xl font-bold tracking-wide text-[var(--texto-primario)] sm:text-3xl">
              Minhas Builds
            </h1>
            <div className="divisor-estrela max-w-xs" aria-hidden="true">
              ✦
            </div>
            <p className="max-w-xl text-sm text-[var(--texto-secundario)]">
              Organize personagens, armas, artefatos e metas de atributos em um só painel.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3.5 sm:items-end">
            <Link to="/personagens/novo" className="btn btn-gold">
              <Plus className="h-4 w-4" />
              Novo Personagem
            </Link>
            {resumo.total > 0 && (
              <div className="w-full min-w-[200px] space-y-1.5 sm:w-56">
                <div className="flex items-center justify-between text-[11px] text-[var(--texto-secundario)]">
                  <span>Progresso concluído</span>
                  <span className="font-mono-tabular font-semibold text-gold">{resumo.taxaPronto}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--borda-sutil)] bg-black/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#b88d28] via-[#e2c16b] to-[#f6df9b] shadow-[0_0_12px_rgba(226,193,107,0.65)] transition-all duration-500"
                    style={{ width: `${resumo.taxaPronto}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cards de resumo */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setStatusFiltro('TODOS')}
          className={`glass relative overflow-hidden p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--ouro-borda)] ${
            statusFiltro === 'TODOS'
              ? 'border-[var(--ouro-borda)] bg-gold/[0.06]'
              : ''
          }`}
        >
          <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider uppercase text-[var(--texto-mutado)]">Total</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <p className="font-mono-tabular mt-2 text-3xl font-semibold text-[var(--texto-primario)]">{resumo.total}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFiltro((s) => (s === 'PRONTO' ? 'TODOS' : 'PRONTO'))}
          className={`glass relative overflow-hidden p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-400/45 ${
            statusFiltro === 'PRONTO' ? 'border-emerald-400/65 bg-emerald-500/[0.08]' : ''
          }`}
        >
          <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider uppercase text-emerald-300/85">Prontos</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-500/15 text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="font-mono-tabular mt-2 text-3xl font-semibold text-emerald-300">{resumo.prontos}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFiltro((s) => (s === 'FARMANDO' ? 'TODOS' : 'FARMANDO'))}
          className={`glass relative overflow-hidden p-4 text-left transition hover:-translate-y-0.5 hover:border-amber-400/45 ${
            statusFiltro === 'FARMANDO' ? 'border-amber-400/65 bg-amber-500/[0.08]' : ''
          }`}
        >
          <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider uppercase text-amber-300/85">Farmando</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/25 bg-amber-500/15 text-amber-300">
              <Hammer className="h-4 w-4" />
            </span>
          </div>
          <p className="font-mono-tabular mt-2 text-3xl font-semibold text-amber-300">{resumo.farmando}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFiltro((s) => (s === 'WISHLIST' ? 'TODOS' : 'WISHLIST'))}
          className={`glass relative overflow-hidden p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-400/45 ${
            statusFiltro === 'WISHLIST' ? 'border-sky-400/65 bg-sky-500/[0.08]' : ''
          }`}
        >
          <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider uppercase text-sky-300/85">Wishlist</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-500/15 text-sky-300">
              <Bookmark className="h-4 w-4" />
            </span>
          </div>
          <p className="font-mono-tabular mt-2 text-3xl font-semibold text-sky-300">{resumo.wishlist}</p>
        </button>
      </section>

      {/* Busca e Filtros */}
      <section className="glass space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--texto-mutado)]" />
            <input
              type="search"
              placeholder="Buscar personagem por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input !pl-9"
              aria-label="Buscar personagem por nome"
            />
          </div>

          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="input md:w-52"
            aria-label="Filtrar por status da build"
          >
            <option value="TODOS">Todos os status</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {temFiltroAtivo && (
            <button type="button" onClick={limparFiltros} className="btn btn-ghost shrink-0 text-xs">
              <X className="h-3.5 w-3.5" />
              Limpar
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--borda-sutil)] pt-3.5">
          <button
            type="button"
            onClick={() => setElementoFiltro('TODOS')}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition ${
              elementoFiltro === 'TODOS'
                ? 'border-[var(--ouro-borda)] bg-gold/15 text-gold shadow-[0_0_16px_-6px_rgba(226,193,107,0.6)]'
                : 'border-[var(--borda-sutil)] bg-[var(--bg-input)] text-[var(--texto-secundario)] hover:border-[var(--borda-ativa)]'
            }`}
          >
            Todos
          </button>

          {elementos.map((el) => {
            const ativo = String(elementoFiltro) === String(el.id)
            return (
              <button
                key={el.id}
                type="button"
                onClick={() => setElementoFiltro(ativo ? 'TODOS' : String(el.id))}
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition"
                style={{
                  color: ativo ? '#090c17' : el.corHex,
                  borderColor: ativo ? el.corHex : `${el.corHex}48`,
                  backgroundColor: ativo ? el.corHex : `${el.corHex}14`,
                  boxShadow: ativo ? `0 0 20px -5px ${el.corHex}` : 'none',
                }}
              >
                <IconeElemento nome={el.nome} className="h-3.5 w-3.5" />
                {el.nome}
              </button>
            )
          })}
        </div>
      </section>

      {error && (
        <div className="space-y-3">
          <Alerta message={error} onClose={() => setError('')} />
          <button type="button" onClick={carregarDados} className="btn btn-ghost text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Tentar novamente
          </button>
        </div>
      )}

      {loading ? (
        <Carregando label="Carregando personagens..." />
      ) : filtrados.length === 0 ? (
        <div className="glass moldura-ornamental flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <EmblemaMarca className="h-10 w-10 text-gold/55" />
          <p className="text-base font-medium text-[var(--texto-primario)]">
            {temFiltroAtivo
              ? 'Nenhum personagem encontrado com os filtros aplicados.'
              : 'Você ainda não cadastrou nenhum personagem.'}
          </p>
          <p className="max-w-md text-sm text-[var(--texto-secundario)]">
            {temFiltroAtivo
              ? 'Tente limpar a busca ou selecionar outro elemento/status.'
              : 'Clique em "Novo Personagem" para cadastrar sua primeira build com arma, artefatos e metas.'}
          </p>
          {temFiltroAtivo ? (
            <button type="button" onClick={limparFiltros} className="btn btn-ghost mt-2">
              Limpar filtros
            </button>
          ) : (
            <Link to="/personagens/novo" className="btn btn-gold mt-2">
              <Plus className="h-4 w-4" />
              Cadastrar Personagem
            </Link>
          )}
        </div>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--texto-mutado)]">
            <span>
              Exibindo <strong className="font-mono-tabular text-[var(--texto-primario)]">{filtrados.length}</strong>{' '}
              {filtrados.length === 1 ? 'personagem' : 'personagens'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((personagem) => (
              <CartaoPersonagem key={personagem.id} personagem={personagem} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
