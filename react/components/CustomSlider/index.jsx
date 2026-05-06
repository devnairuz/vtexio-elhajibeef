import React, { useState, useCallback, useEffect } from 'react'
import styles from './customslider.css'

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

const IconArrowLeft = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const IconArrowRight = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const CustomSlider = ({
  slides = [],
  loop = true,
  autoplay = false,
  autoplayInterval = 5000,
  showDots = true,
}) => {
  const [current, setCurrent] = useState(0)
  const total = slides.length

  // Autoplay
  useEffect(() => {
    if (!autoplay || total <= 1) return undefined

    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % total)
    }, autoplayInterval)

    return () => clearInterval(timer)
  }, [autoplay, autoplayInterval, total])

  const goTo = useCallback((index) => {
    setCurrent(index)
  }, [])

  const goPrev = useCallback(() => {
    if (loop) {
      setCurrent(prev => (prev - 1 + total) % total)
    } else {
      setCurrent(prev => Math.max(prev - 1, 0))
    }
  }, [loop, total])

  const goNext = useCallback(() => {
    if (loop) {
      setCurrent(prev => (prev + 1) % total)
    } else {
      setCurrent(prev => Math.min(prev + 1, total - 1))
    }
  }, [loop, total])

  if (!slides || total === 0) {
    return (
      <div className={styles.customSliderEmpty}>
        <p>Nenhum slide cadastrado. Adicione slides pelo painel.</p>
      </div>
    )
  }

  const slide = slides[current]
  const canGoPrev = loop || current > 0
  const canGoNext = loop || current < total - 1

  return (
    <section className={styles.customSliderRoot} aria-label="Slider de conteúdo">
      {/* ── CONTEÚDO ── */}
      <div className={styles.customSliderTrack}>
        {/* Lado esquerdo: texto */}
        <div className={styles.customSliderContentSide}>
          <div className={styles.customSliderCounter}>
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>

          <h2 className={styles.customSliderTitle}>{slide.title}</h2>
          <p className={styles.customSliderText}>{slide.text}</p>

          {slide.buttonLabel && slide.buttonUrl && (
            <a
              href={slide.buttonUrl}
              className={styles.customSliderButton}
              target={slide.buttonNewTab ? '_blank' : '_self'}
              rel={slide.buttonNewTab ? 'noopener noreferrer' : undefined}
            >
              {slide.buttonLabel}
            </a>
          )}

          {/* ── NAVEGAÇÃO ── */}
          <div className={styles.customSliderNav}>
            <button
              className={`${styles.customSliderArrow} ${!canGoPrev ? styles.customSliderArrowDisabled : ''}`}
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Slide anterior"
            >
              <IconArrowLeft />
            </button>

            <button
              className={`${styles.customSliderArrow} ${!canGoNext ? styles.customSliderArrowDisabled : ''}`}
              onClick={goNext}
              disabled={!canGoNext}
              aria-label="Próximo slide"
            >
              <IconArrowRight />
            </button>

            {showDots && (
              <div className={styles.customSliderDots} role="tablist">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.customSliderDot} ${i === current ? styles.customSliderDotActive : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Ir para slide ${i + 1}`}
                    aria-selected={i === current}
                    role="tab"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lado direito: imagem */}
        <div className={styles.customSliderImageSide}>
          <img
            key={current} /* força re-render para animação */
            className={styles.customSliderImage}
            src={slide.image}
            alt={slide.imageAlt || slide.title}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

// ─── SCHEMA (Site Editor VTEX) ────────────────────────────────────────────────

CustomSlider.schema = {
  title: 'Slider Customizado',
  description: 'Slider com texto e imagem editáveis pelo painel',
  type: 'object',
  properties: {
    loop: {
      title: 'Loop infinito',
      description: 'Ao chegar no último slide, volta para o primeiro automaticamente',
      type: 'boolean',
      default: true,
    },
    autoplay: {
      title: 'Autoplay',
      description: 'Avançar slides automaticamente',
      type: 'boolean',
      default: false,
    },
    autoplayInterval: {
      title: 'Intervalo do autoplay (ms)',
      description: 'Tempo em milissegundos entre cada slide (ex: 5000 = 5s)',
      type: 'number',
      default: 5000,
    },
    showDots: {
      title: 'Exibir bolinhas de navegação',
      type: 'boolean',
      default: true,
    },
    slides: {
      title: 'Slides',
      type: 'array',
      minItems: 1,
      maxItems: 10,
      items: {
        title: 'Slide',
        type: 'object',
        properties: {
          title: {
            title: 'Título',
            type: 'string',
            default: 'Título do slide',
          },
          text: {
            title: 'Texto',
            description: 'Descrição ou chamada principal do slide',
            type: 'string',
            widget: { 'ui:widget': 'textarea' },
            default: 'Texto do slide',
          },
          image: {
            title: 'Imagem',
            description: 'URL ou upload da imagem',
            type: 'string',
            widget: { 'ui:widget': 'image-uploader' },
            default: '',
          },
          imageAlt: {
            title: 'Texto alternativo da imagem (acessibilidade)',
            type: 'string',
            default: '',
          },
          buttonLabel: {
            title: 'Texto do botão',
            description: 'Deixe vazio para não exibir botão',
            type: 'string',
            default: '',
          },
          buttonUrl: {
            title: 'Link do botão',
            type: 'string',
            default: '',
          },
          buttonNewTab: {
            title: 'Abrir link em nova aba',
            type: 'boolean',
            default: false,
          },
        },
      },
    },
  },
}

export default CustomSlider
