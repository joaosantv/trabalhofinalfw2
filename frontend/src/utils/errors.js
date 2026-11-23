// Extrai a mensagem de erro e os campos invalidos retornados pela API
export function parseApiError(err) {
  if (err?.response) {
    const data = err.response.data || {}
    const fields = data.errosValidacao && typeof data.errosValidacao === 'object' ? data.errosValidacao : {}
    const fieldMsgs = Object.values(fields)
    const base = data.mensagem || data.erro || `Erro ${err.response.status}`
    const message = fieldMsgs.length ? `${base} ${fieldMsgs.join(' · ')}` : base
    return { message, fields }
  }
  if (err?.request) {
    return {
      message: 'Não foi possível conectar ao servidor. Verifique se o backend está em execução.',
      fields: {},
    }
  }
  return { message: err?.message || 'Erro inesperado.', fields: {} }
}
