import React, { useState, useRef } from 'react'
import styles from './FormContato.css'

const MSG_MAX = 500

const FormContato = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formError, setFormError] = useState(null)
  const [errors, setErrors] = useState({})
  const firstErrorRef = useRef(null)

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cidade: '',
    empresa: '',
    telefone: '',
    whatsapp: '',
    assunto: '',
    mensagem: '',
  })

  const onlyDigits = (v) => (v || '').replace(/\D/g, '')

  const isEmailValid = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim())

  const formatPhone = (digits) => {
    const d = (digits || '').slice(0, 11)

    if (!d) return ''
    if (d.length <= 2) return `(${d}`
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) {
      return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    }

    return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7, 11)}`
  }

  const validate = (data) => {
    const e = {}

    if (!data.nome?.trim()) e.nome = 'Informe seu nome.'

    if (!data.email?.trim()) {
      e.email = 'Informe seu e-mail.'
    } else if (!isEmailValid(data.email)) {
      e.email = 'E-mail inválido.'
    }

    if (!data.cidade?.trim()) e.cidade = 'Informe sua cidade.'

    const tel = onlyDigits(data.telefone)

    if (!tel) {
      e.telefone = 'Informe seu telefone com DDD.'
    } else if (tel.length < 10 || tel.length > 11) {
      e.telefone = 'Telefone deve ter 10 ou 11 dígitos.'
    }

    if (!data.assunto?.trim()) e.assunto = 'Informe o assunto.'

    const whats = onlyDigits(data.whatsapp)

    if (whats && (whats.length < 10 || whats.length > 11)) {
      e.whatsapp = 'WhatsApp deve ter 10 ou 11 dígitos.'
    }

    return e
  }

  const validateField = (name, value) => {
    const temp = validate({ ...formData, [name]: value })
    setErrors((prev) => ({ ...prev, [name]: temp[name] }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'telefone' || name === 'whatsapp') return

    if (name === 'mensagem') {
      const sliced = (value || '').slice(0, MSG_MAX)
      setFormData((prev) => ({ ...prev, mensagem: sliced }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) validateField(name, value)
  }

  const handlePhoneChange = (fieldName, value) => {
    const digits = onlyDigits(value).slice(0, 11)

    setFormData((prev) => ({
      ...prev,
      [fieldName]: digits,
    }))

    if (errors[fieldName]) validateField(fieldName, digits)
  }

  const handlePhoneKeyDown = (e) => {
    const ctrl = e.ctrlKey || e.metaKey
    const allowedNav = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'Tab',
    ]

    if (ctrl || allowedNav.includes(e.key)) return
    if (!/^\d$/.test(e.key)) e.preventDefault()
  }

  const handlePhonePaste = (fieldName, e) => {
    e.preventDefault()

    const digits = onlyDigits(
      (e.clipboardData || window.clipboardData).getData('text')
    ).slice(0, 11)

    setFormData((prev) => ({
      ...prev,
      [fieldName]: digits,
    }))

    if (errors[fieldName]) validateField(fieldName, digits)
  }

  const parseErrorResponse = async (res) => {
    const statusMsg = {
      400: 'Dados inválidos. Verifique os campos.',
      401: 'Não autorizado.',
      403: 'Permissão negada.',
      429: 'Muitas tentativas. Tente novamente mais tarde.',
      500: 'Falha no servidor.',
      502: 'Instabilidade no serviço.',
      503: 'Serviço indisponível.',
    }[res.status]

    try {
      const txt = await res.text()

      try {
        const j = JSON.parse(txt)
        return j?.Message || j?.message || j?.error || statusMsg || `Erro ${res.status}`
      } catch {
        return txt || statusMsg || `Erro ${res.status}`
      }
    } catch {
      return statusMsg || 'Não foi possível enviar.'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLoading) return

    setFormError(null)

    const fieldErrors = validate(formData)
    setErrors(fieldErrors)

    if (Object.keys(fieldErrors).length) {
      const firstKey = Object.keys(fieldErrors)[0]

      firstErrorRef.current
        ?.querySelector(`[name="${firstKey}"]`)
        ?.focus()

      setFormError('Há erros no formulário. Corrija os campos destacados.')
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        cidade: formData.cidade.trim(),
        empresa: formData.empresa?.trim() || '',
        telefone: onlyDigits(formData.telefone),
        whatsapp: onlyDigits(formData.whatsapp),
        assunto: formData.assunto.trim(),
        mensagem: formData.mensagem?.trim() || '',
        dataEnvio: new Date().toISOString(),
        status: 'pending',
      }

      const createRes = await fetch('/api/dataentities/FC/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.vtex.ds.v10+json',
        },
        body: JSON.stringify(payload),
      })

      if (!createRes.ok) {
        throw new Error(await parseErrorResponse(createRes))
      }

      setIsSubmitted(true)

      setTimeout(() => {
        firstErrorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 0)

      setFormData({
        nome: '',
        email: '',
        cidade: '',
        empresa: '',
        telefone: '',
        whatsapp: '',
        assunto: '',
        mensagem: '',
      })

      setErrors({})
    } catch (err) {
      console.error(err)
      setFormError(
        err?.message || 'Não foi possível enviar. Tente novamente em instantes.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.containerFaleConosco} ref={firstErrorRef}>
      {isSubmitted && (
        <div className={styles.successBanner} role="status" aria-live="polite">
          <strong>Recebido com sucesso!</strong>
        </div>
      )}

      {!isSubmitted && (
        <form className={styles.formContato} onSubmit={handleSubmit} noValidate>
          {formError && (
            <div role="alert" className={styles.formErrorBox}>
              {formError}
            </div>
          )}

          <div className={styles.formGrid}>
            <div>
              <label htmlFor="fc-nome" className={styles.labelForm}>
                Nome
              </label>
              <input
                id="fc-nome"
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                onBlur={(e) => validateField('nome', e.target.value)}
                disabled={isLoading}
                autoComplete="name"
                aria-invalid={!!errors.nome}
              />
              {errors.nome && (
                <small className={styles.errorText}>{errors.nome}</small>
              )}
            </div>

            <div>
              <label htmlFor="fc-email" className={styles.labelForm}>
                E-mail
              </label>
              <input
                id="fc-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={(e) => validateField('email', e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <small className={styles.errorText}>{errors.email}</small>
              )}
            </div>

            <div>
              <label htmlFor="fc-cidade" className={styles.labelForm}>
                Cidade
              </label>
              <input
                id="fc-cidade"
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                onBlur={(e) => validateField('cidade', e.target.value)}
                disabled={isLoading}
                aria-invalid={!!errors.cidade}
              />
              {errors.cidade && (
                <small className={styles.errorText}>{errors.cidade}</small>
              )}
            </div>

            <div>
              <label htmlFor="fc-empresa" className={styles.labelForm}>
                Empresa
              </label>
              <input
                id="fc-empresa"
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-invalid={!!errors.empresa}
              />
            </div>

            <div>
              <label htmlFor="fc-telefone" className={styles.labelForm}>
                Telefone
              </label>
              <input
                id="fc-telefone"
                type="tel"
                name="telefone"
                value={formatPhone(formData.telefone)}
                onChange={(e) => handlePhoneChange('telefone', e.target.value)}
                onKeyDown={handlePhoneKeyDown}
                onPaste={(e) => handlePhonePaste('telefone', e)}
                onBlur={(e) =>
                  validateField('telefone', onlyDigits(e.target.value))
                }
                disabled={isLoading}
                autoComplete="tel"
                inputMode="numeric"
                maxLength={16}
                aria-invalid={!!errors.telefone}
              />
              {errors.telefone && (
                <small className={styles.errorText}>{errors.telefone}</small>
              )}
            </div>

            <div>
              <label htmlFor="fc-whatsapp" className={styles.labelForm}>
                WhatsApp
              </label>
              <input
                id="fc-whatsapp"
                type="tel"
                name="whatsapp"
                value={formatPhone(formData.whatsapp)}
                onChange={(e) => handlePhoneChange('whatsapp', e.target.value)}
                onKeyDown={handlePhoneKeyDown}
                onPaste={(e) => handlePhonePaste('whatsapp', e)}
                onBlur={(e) =>
                  validateField('whatsapp', onlyDigits(e.target.value))
                }
                disabled={isLoading}
                autoComplete="tel"
                inputMode="numeric"
                maxLength={16}
                aria-invalid={!!errors.whatsapp}
              />
              {errors.whatsapp && (
                <small className={styles.errorText}>{errors.whatsapp}</small>
              )}
            </div>

            <div className={styles.fullField}>
              <label htmlFor="fc-assunto" className={styles.labelForm}>
                Assunto
              </label>
              <select
                id="fc-assunto"
                name="assunto"
                value={formData.assunto}
                onChange={handleInputChange}
                onBlur={(e) => validateField('assunto', e.target.value)}
                disabled={isLoading}
                aria-invalid={!!errors.assunto}
                className={!formData.assunto ? styles.selectPlaceholder : undefined}
              >
                <option value="" disabled>Selecione</option>
                <option value="Dúvida">Dúvida</option>
                <option value="Sugestão">Sugestão</option>
                <option value="Reclamação">Reclamação</option>
                <option value="Elogio">Elogio</option>
                <option value="Atendimento">Atendimento</option>
                <option value="Outros">Outros</option>
              </select>
              {errors.assunto && (
                <small className={styles.errorText}>{errors.assunto}</small>
              )}
            </div>

            <div className={styles.fullField}>
              <label htmlFor="fc-mensagem" className={styles.labelForm}>
                Mensagem
              </label>
              <textarea
                id="fc-mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleInputChange}
                disabled={isLoading}
                maxLength={MSG_MAX}
                rows={4}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Enviando...' : 'Enviar mensagem'}
          </button>
        </form>
      )}
    </div>
  )
}

export default FormContato