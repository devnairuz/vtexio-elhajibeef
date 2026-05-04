import React, { useEffect, useMemo, useState } from 'react'
import styles from './banner.slider.css'

const DEFAULT_SLIDES = [
  {
    imageDesktop: 'assets/slider-principal/desk/basic-looks.png',
    imageMobile: 'assets/slider-principal/desk/basic-looks.png',
    eyebrow: 'ONDE A',
    titleHighlight: 'excelencia',
    title: 'comeca no corte.',
    buttonText: 'Conheca nossa origem',
    link: '/quem-somos',
  },
]

const getSlideImage = slide => slide.imageMobile || slide.imageDesktop

const BannerSlider = ({ slides = DEFAULT_SLIDES, autoplay = true, autoplayDelay = 5000 }) => {
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

  const goToPrevious = () => {
    setCurrentIndex(index => (index === 0 ? slideItems.length - 1 : index - 1))
  }

  const goToNext = () => {
    setCurrentIndex(index => (index + 1) % slideItems.length)
  }

  return (
    <section className={styles.bannerSlider}>
      <div
        className={styles.track}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slideItems.map((slide, index) => (
          <article className={styles.slide} key={`${slide.imageDesktop}-${index}`}>
            <picture className={styles.picture}>
              {slide.imageMobile && (
                <source media="(max-width: 767px)" srcSet={slide.imageMobile} />
              )}
              <img
                alt={slide.alt || slide.title || 'Banner principal'}
                className={styles.image}
                loading={index === 0 ? 'eager' : 'lazy'}
                src={getSlideImage(slide)}
              />
            </picture>

            <div className={styles.content}>
              {slide.eyebrow && <p className={styles.eyebrow}>{slide.eyebrow}</p>}
              {(slide.titleHighlight || slide.title) && (
                <h2 className={styles.title}>
                  {slide.titleHighlight && (
                    <span className={styles.titleHighlight}>{slide.titleHighlight}</span>
                  )}
                  {slide.title && <span>{slide.title}</span>}
                </h2>
              )}
              {slide.buttonText && slide.link && (
                <a className={styles.button} href={slide.link}>
                  {slide.buttonText}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {slideItems.length > 1 && (
        <>
          <button
            aria-label="Banner anterior"
            className={`${styles.arrow} ${styles.arrowPrevious}`}
            onClick={goToPrevious}
            type="button"
          />
          <button
            aria-label="Proximo banner"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={goToNext}
            type="button"
          />
          <div className={styles.dots}>
            {slideItems.map((_, index) => (
              <button
                aria-label={`Ir para banner ${index + 1}`}
                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                key={index}
                onClick={() => setCurrentIndex(index)}
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
  description: 'Carrossel principal com imagem, textos e botao editaveis.',
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
