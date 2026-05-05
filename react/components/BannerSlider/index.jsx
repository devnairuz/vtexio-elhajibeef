import React, { useEffect, useMemo, useState, useCallback } from 'react'
import styles from './banner.slider.css'

const DEFAULT_SLIDES = [
  {
    imageDesktop: 'assets/slider-principal/desk/bannertopo.png',
    imageMobile: 'assets/slider-principal/mob/bannertopomob.png',
    eyebrow: 'ONDE A',
    titleHighlight: 'excelência',
    title: 'começa no corte.',
    buttonText: 'Conheça nossa origem',
    link: '/quem-somos',
    alt: 'Banner principal - Onde a excelência começa no corte',
  },
]

// CORRIGIDO: desktop como fallback, não mobile
const getSlideImage = slide => slide.imageDesktop || slide.imageMobile

const BannerSlider = ({
  slides = DEFAULT_SLIDES,
  autoplay = true,
  autoplayDelay = 5000,
}) => {
  const slideItems = useMemo(() => {
    return slides?.length ? slides : DEFAULT_SLIDES
  }, [slides])

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setCurrentIndex(0)
  }, [slideItems.length])

  useEffect(() => {
    if (!autoplay || slideItems.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setCurrentIndex(index => (index + 1) % slideItems.length)
    }, autoplayDelay)

    return () => window.clearInterval(timer)
  }, [autoplay, autoplayDelay, slideItems.length])

  // CORRIGIDO: useCallback para evitar recriação desnecessária das funções
  const goToPrevious = useCallback(() => {
    setCurrentIndex(index => (index === 0 ? slideItems.length - 1 : index - 1))
  }, [slideItems.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(index => (index + 1) % slideItems.length)
  }, [slideItems.length])

  const goToIndex = useCallback(index => {
    setCurrentIndex(index)
  }, [])

  return (
    // CORRIGIDO: aria-label adicionado para acessibilidade
    <section
      aria-label="Banner principal"
      aria-roledescription="carrossel"
      className={styles.elhajiBannerSlider}
      role="region"
    >
      <div
        className={styles.elhajiBannerSliderTrack}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slideItems.map((slide, index) => {
          // CORRIGIDO: key mais robusta usando índice + título para evitar duplicatas
          const slideKey = `slide-${index}-${slide.titleHighlight || slide.title || index}`

          return (
            <article
              aria-label={`Slide ${index + 1} de ${slideItems.length}`}
              aria-roledescription="slide"
              className={styles.elhajiBannerSliderSlide}
              key={slideKey}
            >
              <picture className={styles.elhajiBannerSliderPicture}>
                {slide.imageMobile && (
                  <source media="(max-width: 767px)" srcSet={slide.imageMobile} />
                )}
                <img
                  alt={slide.alt || slide.title || 'Banner principal'}
                  className={styles.elhajiBannerSliderImage}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  src={getSlideImage(slide)}
                />
              </picture>

              <div className={styles.elhajiBannerSliderContent}>
                {slide.eyebrow && (
                  <p className={styles.elhajiBannerSliderEyebrow}>{slide.eyebrow}</p>
                )}
                {(slide.titleHighlight || slide.title) && (
                  <h2 className={styles.elhajiBannerSliderTitle}>
                    {slide.titleHighlight && (
                      <span className={styles.elhajiBannerSliderTitleHighlight}>
                        {slide.titleHighlight}
                      </span>
                    )}
                    {slide.title && <span>{slide.title}</span>}
                  </h2>
                )}
                {slide.buttonText && slide.link && (
                  <a className={styles.elhajiBannerSliderButton} href={slide.link}>
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {slideItems.length > 1 && (
        <>
          <button
            aria-label="Banner anterior"
            className={`${styles.elhajiBannerSliderArrow} ${styles.elhajiBannerSliderArrowPrevious}`}
            onClick={goToPrevious}
            type="button"
          />
          <button
            aria-label="Próximo banner"
            className={`${styles.elhajiBannerSliderArrow} ${styles.elhajiBannerSliderArrowNext}`}
            onClick={goToNext}
            type="button"
          />
          <div aria-label="Navegação dos slides" className={styles.elhajiBannerSliderDots} role="tablist">
            {slideItems.map((slide, index) => (
              <button
                aria-label={`Ir para banner ${index + 1}`}
                aria-selected={index === currentIndex}
                className={`${styles.elhajiBannerSliderDot} ${
                  index === currentIndex ? styles.elhajiBannerSliderDotActive : ''
                }`}
                key={`dot-${index}`}
                onClick={() => goToIndex(index)}
                role="tab"
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

BannerSlider.schema = {
  title: 'Banner principal',
  description: 'Carrossel principal com imagem, textos e botão editáveis.',
  type: 'object',
  properties: {
    autoplay: {
      title: 'Ativar autoplay',
      type: 'boolean',
      default: true,
    },
    autoplayDelay: {
      title: 'Tempo do autoplay em ms',
      type: 'number',
      default: 5000,
    },
    slides: {
      title: 'Slides',
      type: 'array',
      minItems: 1,
      __editorItemTitle: 'title',
      default: DEFAULT_SLIDES,
      items: {
        title: 'Slide',
        type: 'object',
        properties: {
          imageDesktop: {
            title: 'Imagem desktop',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          imageMobile: {
            title: 'Imagem mobile',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          alt: {
            title: 'Texto alternativo da imagem',
            type: 'string',
          },
          eyebrow: {
            title: 'Texto pequeno',
            type: 'string',
            default: 'ONDE A',
          },
          titleHighlight: {
            title: 'Titulo destacado',
            type: 'string',
            default: 'excelencia',
          },
          title: {
            title: 'Titulo complementar',
            type: 'string',
            default: 'comeca no corte.',
          },
          buttonText: {
            title: 'Texto do botao',
            type: 'string',
            default: 'Conheca nossa origem',
          },
          link: {
            title: 'Link do botao',
            type: 'string',
            default: '/quem-somos',
          },
        },
      },
    },
  },
}

export default BannerSlider
