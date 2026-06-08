import React, { Children, useCallback, useEffect, useRef, useState } from 'react'

import styles from './peekScrollSlider.css'

const PeekScrollSlider = ({
  children,
  itemWidth = 255,
  gap = 12,
  edgePadding = 20,
}) => {
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const items = Children.toArray(children).filter(Boolean)
  const totalItems = items.length

  useEffect(() => {
    const el = scrollRef.current
    if (!el || totalItems <= 1) return undefined

    let frame = null
    const step = itemWidth + gap

    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const index = Math.round(el.scrollLeft / step)
        const clamped = Math.max(0, Math.min(index, totalItems - 1))
        setActiveIndex(prev => (prev === clamped ? prev : clamped))
        frame = null
      })
    }

    el.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      el.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [itemWidth, gap, totalItems])

  const goToIndex = useCallback(
    index => {
      const el = scrollRef.current
      if (!el) return
      const step = itemWidth + gap
      el.scrollTo({ left: index * step, behavior: 'smooth' })
    },
    [itemWidth, gap]
  )

  if (!totalItems) return null

  return (
    <div className={styles.peekSliderWrapper}>
      <div
        ref={scrollRef}
        className={styles.peekSliderTrack}
        style={{
          gap: `${gap}px`,
          paddingLeft: `${edgePadding}px`,
          paddingRight: `${edgePadding}px`,
          scrollPaddingLeft: `${edgePadding}px`,
        }}
      >
        {items.map((child, index) => (
          <div
            key={`peek-slide-${index}`}
            className={styles.peekSliderSlide}
            style={{ flexBasis: `${itemWidth}px`, width: `${itemWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>

      {totalItems > 1 && (
        <div className={styles.peekSliderDots} role="tablist" aria-label="Paginação do slider">
          {items.map((_, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={`peek-dot-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Ir para item ${index + 1}`}
                className={`${styles.peekSliderDot} ${
                  isActive ? styles.peekSliderDotActive : ''
                }`}
                onClick={() => goToIndex(index)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

PeekScrollSlider.schema = {
  title: 'Slider com peek e dots (mobile)',
  description:
    'Scroll horizontal nativo com snap, peek do próximo item e indicadores de paginação. Use dentro de responsive-layout.mobile.',
  type: 'object',
  properties: {
    itemWidth: {
      title: 'Largura de cada item (px)',
      type: 'number',
      default: 255,
    },
    gap: {
      title: 'Espaço entre itens (px)',
      type: 'number',
      default: 12,
    },
    edgePadding: {
      title: 'Padding lateral (px)',
      type: 'number',
      default: 20,
    },
  },
}

export default PeekScrollSlider
