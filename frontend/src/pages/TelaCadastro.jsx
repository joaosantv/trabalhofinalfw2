import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Alerta from '../components/Alerta'
import { EmblemaMarca } from '../components/BarraNavegacao'
import { IndicadorCarregamento } from '../components/Carregando'
import IconeElemento from '../components/IconeElemento'
import { parseApiError } from '../utils/errors'

const ELEMENTOS_PREVIEW = [
  { nome: 'Pyro', cor: '#EF7938' },
  { nome: 'Hydro', cor: '#4CC2F1' },
  { nome: 'Anemo', cor: '#74C2A8' },
  { nome: 'Electro', cor: '#AF8EC1' },
  { nome: 'Dendro', cor: '#A5C83B' },
  { nome: 'Cryo', cor: '#9FD6E3' },
  { nome: 'Geo', cor: '#FAB632' },
]

export default function TelaCadastro() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      await register({ nome, email, senha })
      navigate('/', { replace: true })
    } catch (err) {
      const parsed = parseApiError(err)
      setError(parsed.message)
      setFieldErrors(parsed.fields)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Fundo decorativo */}
      <svg
        viewBox="0 0 600 600"
        className="girar-lento pointer-events-none absolute h-[680px] w-[680px] opacity-[0.09]"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="300" cy="300" r="260" stroke="#E2C16B" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="300" cy="300" r="195" stroke="#E2C16B" strokeWidth="0.7" />
        <rect x="300" y="90" width="296" height="296" transform="rotate(45 300 90)" stroke="#E2C16B" strokeWidth="0.8" />
      </svg>

      <div className="animar-entrada relative z-10 w-full max-w-md space-y-6">
        <div className="glass glass-gold moldura-ornamental space-y-6 p-8">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--ouro-borda)] bg-[var(--bg-superficie-elevada)] shadow-[0_0_26px_-8px_rgba(226,193,107,0.65)]">
              <EmblemaMarca className="h-7 w-7 text-gold" />
            </div>
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-bold tracking-[0.18em] text-[var(--texto-primario)]">
                BUILD<span className="text-gold">PLANNER</span>
              </h1>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--texto-mutado)]">
                Criar Conta de Viajante
              </p>
            </div>
            <div className="divisor-estrela pt-1" aria-hidden="true">
              ✦
            </div>
          </div>

          <Alerta message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="nome"
                className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
              >
                Nome
              </label>
              <input
                id="nome"
                type="text"
                required
                autoComplete="name"
                placeholder="Seu nome de Viajante"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input"
                disabled={loading}
              />
              {fieldErrors.nome && <p className="text-xs text-red-300">{fieldErrors.nome}</p>}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="viajante@teyvat.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                disabled={loading}
              />
              {fieldErrors.email && <p className="text-xs text-red-300">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="senha"
                className="block text-xs font-medium tracking-wider uppercase text-[var(--texto-secundario)]"
              >
                Senha
              </label>
              <input
                id="senha"
                type="password"
                required
                minLength={6}
                maxLength={72}
                autoComplete="new-password"
                placeholder="Mínimo de 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input"
                disabled={loading}
              />
              {fieldErrors.senha && <p className="text-xs text-red-300">{fieldErrors.senha}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-gold w-full py-2.5">
              {loading ? (
                <>
                  <IndicadorCarregamento className="h-4 w-4 !text-[#0b0e1a]" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Cadastrar
                </>
              )}
            </button>
          </form>

          <p className="border-t border-[var(--borda-sutil)] pt-5 text-center text-sm text-[var(--texto-secundario)]">
            Já possui conta?{' '}
            <Link to="/login" className="font-semibold text-gold hover:underline">
              Fazer login
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          {ELEMENTOS_PREVIEW.map((el) => (
            <span
              key={el.nome}
              title={el.nome}
              className="flex h-8 w-8 items-center justify-center rounded-full border bg-[#111626]/70"
              style={{ color: el.cor, borderColor: `${el.cor}33` }}
            >
              <IconeElemento nome={el.nome} className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
