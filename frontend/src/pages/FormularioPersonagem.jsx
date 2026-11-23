import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Star } from 'lucide-react'
import api from '../services/api'
import Alerta from '../components/Alerta'
import Carregando, { IndicadorCarregamento } from '../components/Carregando'
import { SeloStatus } from '../components/CartaoPersonagem'
import IconeElemento from '../components/IconeElemento'
import { STATUS_OPTIONS } from '../utils/constants'
import { parseApiError } from '../utils/errors'

const INITIAL_FORM = {
  nome: '',
  raridade: 5,
  armaEquipada: '',
  nivel: 90,
  statusBuild: 'FARMANDO',
  conjuntoArtefatos: '',
  statusAlvo: '',
  observacoes: '',
  imagemUrl: '',
  elementoId: '',
}

export default function FormularioPersonagem() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL_FORM)
  const [elementos, setElementos] = useState([])
  const [loadingInit, setLoadingInit] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    let active = true

    async function load() {
      setLoadingInit(true)
      setError('')
      try {
        const requests = [api.get('/elementos')]
        if (isEditing) requests.push(api.get(`/personagens/${id}`))

        const [elemRes, persRes] = await Promise.all(requests)
        if (!active) return

        const elemList = Array.isArray(elemRes.data) ? elemRes.data : []
        setElementos(elemList)

        if (isEditing && persRes?.data) {
          const p = persRes.data
          setForm({
            nome: p.nome ?? '',
            raridade: p.raridade ?? 5,
            armaEquipada: p.armaEquipada ?? '',
            nivel: p.nivel ?? 1,
            statusBuild: p.statusBuild ?? 'FARMANDO',
            conjuntoArtefatos: p.conjuntoArtefatos ?? '',
            statusAlvo: p.statusAlvo ?? '',
            observacoes: p.observacoes ?? '',
            imagemUrl: p.imagemUrl ?? '',
            elementoId: p.elemento?.id ? String(p.elemento.id) : '',
          })
        } else if (elemList.length > 0) {
          setForm((prev) => (prev.elementoId ? prev : { ...prev, elementoId: String(elemList[0].id) }))
        }
      } catch (err) {
        if (active) setError(parseApiError(err).message)
      } finally {
        if (active) setLoadingInit(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [id, isEditing])

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setSaving(true)

    const payload = {
      nome: form.nome.trim(),
      raridade: Number(form.raridade),
      armaEquipada: form.armaEquipada.trim(),
      nivel: Number(form.nivel),
      statusBuild: form.statusBuild,
      conjuntoArtefatos: form.conjuntoArtefatos.trim(),
      statusAlvo: form.statusAlvo.trim(),
      observacoes: form.observacoes.trim(),
      imagemUrl: form.imagemUrl.trim(),
      elementoId: Number(form.elementoId),
    }

    try {
      if (isEditing) {
        await api.put(`/personagens/${id}`, payload)
        navigate(`/personagens/${id}`, { replace: true })
      } else {
        const { data } = await api.post('/personagens', payload)
        navigate(data?.id ? `/personagens/${data.id}` : '/', { replace: true })
      }
    } catch (err) {
      const parsed = parseApiError(err)
      setError(parsed.message)
      setFieldErrors(parsed.fields)
    } finally {
      setSaving(false)
    }
  }

  if (loadingInit) {
    return <Carregando label={isEditing ? 'Carregando dados da build...' : 'Carregando elementos...'} />
  }

  const isGold = Number(form.raridade) === 5
  const elementoAtual = elementos.find((el) => String(el.id) === String(form.elementoId))
  const cor = elementoAtual?.corHex || '#D4AF37'

  return (
    <div className="animar-entrada mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link to={isEditing ? `/personagens/${id}` : '/'} className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="text-right">
          <p className="text-[11px] font-medium tracking-wider uppercase text-[var(--texto-mutado)]">
            {isEditing ? 'Atualização de Ficha' : 'Novo Registro'}
          </p>
          <h1 className="font-display text-xl font-bold tracking-wide text-[var(--texto-primario)] sm:text-2xl">
            {isEditing ? 'Editar Build' : 'Novo Personagem'}
          </h1>
        </div>
      </div>

      <Alerta message={error} onClose={() => setError('')} />

      {/* Preview da build */}
      <div
        className={`glass ${isGold ? 'glass-gold' : 'glass-silver'} flex flex-wrap items-center justify-between gap-4 px-5 py-4`}
        style={{ backgroundImage: `linear-gradient(115deg, ${cor}1A 0%, transparent 60%)` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-lg border"
            style={{ color: cor, borderColor: `${cor}55`, backgroundColor: `${cor}14` }}
          >
            <IconeElemento nome={elementoAtual?.nome} className="h-5 w-5" />
          </div>
          <div>
            <p className={`font-display text-base font-bold ${isGold ? 'text-gold' : 'text-silver'}`}>
              {form.nome.trim() || 'Nome do Personagem'}
            </p>
            <p className="font-mono-tabular text-xs text-[var(--texto-secundario)]">
              {elementoAtual?.nome || 'Elemento'} · Nv. {form.nivel || 1} · {form.raridade}★
            </p>
          </div>
        </div>
        <SeloStatus status={form.statusBuild} />
      </div>

      <form onSubmit={handleSubmit} className={`glass ${isGold ? 'glass-gold' : 'glass-silver'} space-y-6 p-6`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="nome"
              className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
            >
              Nome do Personagem *
            </label>
            <input
              id="nome"
              type="text"
              required
              placeholder="Ex.: Hu Tao"
              value={form.nome}
              onChange={(e) => updateField('nome', e.target.value)}
              className="input"
              disabled={saving}
            />
            {fieldErrors.nome && <p className="text-xs text-red-300">{fieldErrors.nome}</p>}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="statusBuild"
              className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
            >
              Status da Build *
            </label>
            <select
              id="statusBuild"
              required
              value={form.statusBuild}
              onChange={(e) => updateField('statusBuild', e.target.value)}
              className="input"
              disabled={saving}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.statusBuild && <p className="text-xs text-red-300">{fieldErrors.statusBuild}</p>}
          </div>
        </div>

        {/* Selecao de elemento */}
        <div className="space-y-2">
          <span className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]">
            Elemento *
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
            {elementos.map((el) => {
              const ativo = String(form.elementoId) === String(el.id)
              return (
                <button
                  key={el.id}
                  type="button"
                  disabled={saving}
                  onClick={() => updateField('elementoId', String(el.id))}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-semibold transition"
                  style={{
                    color: ativo ? '#07080C' : el.corHex,
                    borderColor: ativo ? el.corHex : `${el.corHex}40`,
                    backgroundColor: ativo ? el.corHex : `${el.corHex}10`,
                    boxShadow: ativo ? `0 0 18px -6px ${el.corHex}` : 'none',
                  }}
                >
                  <IconeElemento nome={el.nome} className="h-4 w-4" />
                  <span>{el.nome}</span>
                </button>
              )
            })}
          </div>
          {fieldErrors.elementoId && <p className="text-xs text-red-300">{fieldErrors.elementoId}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Selecao de raridade */}
          <div className="space-y-1.5">
            <span className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]">
              Raridade *
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[5, 4].map((r) => {
                const ativo = Number(form.raridade) === r
                const dourado = r === 5
                return (
                  <button
                    key={r}
                    type="button"
                    disabled={saving}
                    onClick={() => updateField('raridade', r)}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                      ativo
                        ? dourado
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-silver bg-silver/15 text-silver'
                        : 'border-[var(--borda-sutil)] bg-[var(--bg-input)] text-[var(--texto-secundario)] hover:border-[var(--borda-ativa)]'
                    }`}
                  >
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-mono-tabular">{r} Estrelas</span>
                  </button>
                )
              })}
            </div>
            {fieldErrors.raridade && <p className="text-xs text-red-300">{fieldErrors.raridade}</p>}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="nivel"
              className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
            >
              Nível (1 a 90) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={90}
                value={form.nivel || 1}
                onChange={(e) => updateField('nivel', Number(e.target.value))}
                className="range-gold flex-1"
                disabled={saving}
                aria-label="Controle deslizante de nível"
              />
              <input
                id="nivel"
                type="number"
                required
                min={1}
                max={90}
                value={form.nivel}
                onChange={(e) => updateField('nivel', e.target.value)}
                className="input font-mono-tabular !w-20 text-center"
                disabled={saving}
              />
            </div>
            {fieldErrors.nivel && <p className="text-xs text-red-300">{fieldErrors.nivel}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="armaEquipada"
              className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
            >
              Arma Equipada *
            </label>
            <input
              id="armaEquipada"
              type="text"
              required
              placeholder="Ex.: Báculo de Homa"
              value={form.armaEquipada}
              onChange={(e) => updateField('armaEquipada', e.target.value)}
              className="input"
              disabled={saving}
            />
            {fieldErrors.armaEquipada && <p className="text-xs text-red-300">{fieldErrors.armaEquipada}</p>}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="conjuntoArtefatos"
              className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
            >
              Conjunto de Artefatos *
            </label>
            <input
              id="conjuntoArtefatos"
              type="text"
              required
              placeholder="Ex.: 4x Bruxa das Chamas Carmesim"
              value={form.conjuntoArtefatos}
              onChange={(e) => updateField('conjuntoArtefatos', e.target.value)}
              className="input"
              disabled={saving}
            />
            {fieldErrors.conjuntoArtefatos && (
              <p className="text-xs text-red-300">{fieldErrors.conjuntoArtefatos}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="statusAlvo"
            className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
          >
            Metas de Atributos (Status Alvo) *
          </label>
          <input
            id="statusAlvo"
            type="text"
            required
            placeholder="Ex.: CRIT 70/200 · HP 30k · EM 200"
            value={form.statusAlvo}
            onChange={(e) => updateField('statusAlvo', e.target.value)}
            className="input font-mono-tabular"
            disabled={saving}
          />
          {fieldErrors.statusAlvo && <p className="text-xs text-red-300">{fieldErrors.statusAlvo}</p>}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="imagemUrl"
            className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
          >
            URL da Imagem (opcional)
          </label>
          <input
            id="imagemUrl"
            type="url"
            placeholder="https://..."
            value={form.imagemUrl}
            onChange={(e) => updateField('imagemUrl', e.target.value)}
            className="input"
            disabled={saving}
          />
          {fieldErrors.imagemUrl && <p className="text-xs text-red-300">{fieldErrors.imagemUrl}</p>}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="observacoes"
            className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
          >
            Observações Táticas (opcional)
          </label>
          <textarea
            id="observacoes"
            rows={4}
            maxLength={1000}
            placeholder="Anotações sobre talentos, constelações, rotações e times recomendados..."
            value={form.observacoes}
            onChange={(e) => updateField('observacoes', e.target.value)}
            className="input resize-y"
            disabled={saving}
          />
          {fieldErrors.observacoes && <p className="text-xs text-red-300">{fieldErrors.observacoes}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[var(--borda-sutil)] pt-5">
          <Link to={isEditing ? `/personagens/${id}` : '/'} className="btn btn-ghost">
            Cancelar
          </Link>
          <button type="submit" disabled={saving} className="btn btn-gold">
            {saving ? (
              <>
                <IndicadorCarregamento className="h-4 w-4 !text-[#090A0D]" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? 'Salvar Alterações' : 'Criar Build'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
