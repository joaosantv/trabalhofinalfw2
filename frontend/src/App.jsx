import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RotaPrivada from './components/RotaPrivada'
import TelaLogin from './pages/TelaLogin'
import TelaCadastro from './pages/TelaCadastro'
import PainelPrincipal from './pages/PainelPrincipal'
import FormularioPersonagem from './pages/FormularioPersonagem'
import DetalhesPersonagem from './pages/DetalhesPersonagem'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<TelaLogin />} />
          <Route path="/cadastro" element={<TelaCadastro />} />

          <Route element={<RotaPrivada />}>
            <Route path="/" element={<PainelPrincipal />} />
            <Route path="/personagens/novo" element={<FormularioPersonagem />} />
            <Route path="/personagens/editar/:id" element={<FormularioPersonagem />} />
            <Route path="/personagens/:id" element={<DetalhesPersonagem />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
