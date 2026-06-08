import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './nossasUnidades.css'

const DEFAULT_STORES = [
  {
    name: 'Brás',
    address: 'Rua Rio Bonito, 1528 - Brás, São Paulo - SP, 03023-000',
    openingHours: 'Seg. a sáb.: 08:00 às 19:00',
    holidayHours: 'Dom. e feriados: 09:00 às 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Moema',
    address: 'Alameda dos Nhambiquaras, 801, Moema, São Paulo - SP, 04090',
    openingHours: 'Seg. a sáb.: 09:00 às 20:00',
    holidayHours: 'Dom. e feriados: 09:00 às 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Tatuapé',
    address: 'Rua Serra de Japi, 843, Tatuapé, São Paulo - SP, 03309-000',
    openingHours: 'Seg. a sáb.: 09:00 às 20:00',
    holidayHours: 'Dom. e feriados: 09:00 às 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Centro - SP',
    address: 'R. Barão de Duprat, 400 - Box 09 Mercado Municipal Kinjo Yamato',
    openingHours: 'Seg. a sáb.: 09:00 às 17:00',
    holidayHours: 'Feriados: 09:00 às 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Santo Amaro',
    address: 'R. Sócrates, 196, Vila Sofia, São Paulo - SP, 04671-070',
    openingHours: 'Seg. a sáb.: 09:00 às 20:00',
    holidayHours: 'Dom. e feriados: 09:00 às 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Aclimação',
    address: 'R. Esmeralda, 61, Aclimação, São Paulo - SP, 01531-040',
    openingHours: 'Seg. a sáb.: 09:00 às 20:00',
    holidayHours: 'Dom. e feriados: 09:00 às 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Tatuí',
    address: 'R. Chiquinha Rodrigues, 1105, Vila Dr. Laurindo, Tatuí - SP, 18271-712',
    openingHours: 'Seg. a sáb.: 08:30 às 19:30',
    holidayHours: 'Dom. e feriados: 08:30 às 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Boituva',
    address: 'Av. Zélia de Lima Rosa, 437, Ah Boituva - SP, 18552-320',
    openingHours: 'Seg. a sáb.: 08:30 às 19:30',
    holidayHours: 'Dom. e feriados: 08:30 às 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Cesário Lange',
    address: 'Avenida 3 de Maio, 1307, Cesário Lange - SP, 18285-000',
    openingHours: 'Seg. a sáb.: 08:30 às 19:30',
    holidayHours: 'Dom. e feriados: 08:00 às 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Cerquilho',
    address: 'R. Dr. Campos, 332, Centro, Cerquilho - SP, 18520-103',
    openingHours: 'Seg. a sáb.: 08:30 às 19:30',
    holidayHours: 'Dom. e feriados: 08:30 às 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
]

const getItemsPerPage = () => {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 3
  return 4
}

const getIsMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 640
}

const MOBILE_ITEM_WIDTH = 255
const MOBILE_GAP = 12

const NossasUnidades = ({ stores }) => {
  const storeItems = stores?.length ? stores : DEFAULT_STORES

  const scrollRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage)
  const [isMobile, setIsMobile] = useState(getIsMobile)
  const [touchStartX, setTouchStartX] = useState(null)

  // Atualiza itemsPerPage ao redimensionar a janela
  useEffect(() => {
    const handleResize = () => {
      const next = getItemsPerPage()
      const nextIsMobile = getIsMobile()
      setItemsPerPage(prev => {
        if (prev !== next) setCurrentIndex(0) // reset ao mudar breakpoint
        return next
      })
      setIsMobile(prev => {
        if (prev !== nextIsMobile) setCurrentIndex(0)
        return nextIsMobile
      })
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!isMobile || !el || storeItems.length <= 1) return undefined

    let frame = null
    const step = MOBILE_ITEM_WIDTH + MOBILE_GAP

    const handleScroll = () => {
      if (frame) return

      frame = window.requestAnimationFrame(() => {
        const index = Math.round(el.scrollLeft / step)
        const clamped = Math.max(0, Math.min(index, storeItems.length - 1))
        setCurrentIndex(prev => (prev === clamped ? prev : clamped))
        frame = null
      })
    }

    el.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      el.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [isMobile, storeItems.length])

  const maxIndex = Math.max(0, storeItems.length - itemsPerPage)

  // Porcentagem baseada no viewport do slider, não no track inteiro
  const cardWidthPercent = 100 / itemsPerPage
  const translateX = -(currentIndex * cardWidthPercent)

  const goToMobileIndex = useCallback(index => {
    const el = scrollRef.current
    if (!el) return

    const clamped = Math.max(0, Math.min(index, storeItems.length - 1))
    el.scrollTo({
      left: clamped * (MOBILE_ITEM_WIDTH + MOBILE_GAP),
      behavior: 'smooth',
    })
  }, [storeItems.length])

  const handlePrev = () => setCurrentIndex(prev => Math.max(0, prev - 1))
  const handleNext = () => setCurrentIndex(prev => Math.min(maxIndex, prev + 1))

  const handleTouchStart = event => {
    setTouchStartX(event.touches[0].clientX)
  }

  const handleTouchEnd = event => {
    if (touchStartX === null) return

    const touchEndX = event.changedTouches[0].clientX
    const swipeDistance = touchStartX - touchEndX
    const minSwipeDistance = 40

    if (!isMobile && Math.abs(swipeDistance) >= minSwipeDistance) {
      if (swipeDistance > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }

    setTouchStartX(null)
  }

  return (
    <section className={styles.nossasUnidades}>
      <div className={styles.headerunidades}>
        <span className={styles.eyebrow}> NOSSAS UNIDADES</span>
        <h2 className={styles.lojastitle}>Localize a unidade El Haji Beef mais próxima para descobrir a excelência de nossos cortes exclusivos. Nossas boutiques unem a tradição da Fazenda São João à alta tecnologia: garantindo um atendimento especializado e o rigor do padrão 100% Halal em cada escolha.</h2>
      </div>

      <div className={styles.sliderContainer}>
        <button
          aria-label="Anterior"
          className={`${styles.arrowButton} ${styles.arrowPrev}`}
          disabled={currentIndex === 0}
          onClick={handlePrev}
          type="button"
        >
          <span aria-hidden="true" className={`${styles.arrowIcon} ${styles.arrowLeftIcon}`} />
        </button>

        <div
          ref={scrollRef}
          className={styles.sliderViewport}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
        >
          <div
            className={styles.sliderTrack}
            style={isMobile ? undefined : { transform: `translateX(${translateX}%)` }}
          >
            {storeItems.map((store, index) => (
              <article
                className={styles.storeCard}
                key={`${store.name}-${index}`}
                style={
                  isMobile
                    ? {
                        width: `${MOBILE_ITEM_WIDTH}px`,
                        flexBasis: `${MOBILE_ITEM_WIDTH}px`,
                        flexShrink: 0,
                      }
                    : { width: `${cardWidthPercent}%`, flexShrink: 0 }
                }
              >
                <img
                  alt={`Loja ${store.name}`}
                  className={styles.storeImage}
                  decoding="async"
                  height="370"
                  loading="lazy"
                  src={store.image}
                  width="255"
                />
                <div className={styles.storeOverlay}>
                  <div className={styles.storeHeading}>
                    <span className={styles.storeLabel}>Loja</span>
                    <h3 className={styles.storeName}>{store.name}</h3>
                  </div>
                  <div className={styles.storeInfo}>
                    <span aria-hidden="true" className={`${styles.storeIcon} ${styles.locationIcon}`} />
                    <p className={styles.storeText}>{store.address}</p>
                  </div>
                  <div className={styles.storeInfo}>
                    <span aria-hidden="true" className={`${styles.storeIcon} ${styles.clockIcon}`} />
                    <p className={styles.storeText}>
                      {store.openingHours}
                      {store.holidayHours && <><br />{store.holidayHours}</>}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          aria-label="Proximo"
          className={`${styles.arrowButton} ${styles.arrowNext}`}
          disabled={currentIndex === maxIndex}
          onClick={handleNext}
          type="button"
        >
          <span aria-hidden="true" className={`${styles.arrowIcon} ${styles.arrowRightIcon}`} />
        </button>
      </div>

      <div className={styles.dots}>
        {Array.from({ length: isMobile ? storeItems.length : maxIndex + 1 }).map((_, i) => (
          <button
            aria-label={`Ir para slide ${i + 1}`}
            className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
            key={i}
            onClick={() => (isMobile ? goToMobileIndex(i) : setCurrentIndex(i))}
            type="button"
          />
        ))}
      </div>
    </section>
  )
}

NossasUnidades.schema = {
  title: 'Nossas unidades',
  description: 'Carrossel com as unidades da loja.',
  type: 'object',
  properties: {
    stores: {
      title: 'Lojas',
      type: 'array',
      minItems: 1,
      __editorItemTitle: 'name',
      default: DEFAULT_STORES,
      items: {
        title: 'Loja',
        type: 'object',
        properties: {
          name: { title: 'Nome da loja', type: 'string', default: 'Moema' },
          address: { title: 'Endereco', type: 'string', default: 'Alameda dos Nhambiquaras, 801, Moema, São Paulo - SP, 04090' },
          openingHours: { title: 'Horario principal', type: 'string', default: 'Seg. a sáb.: 09:00 às 20:00' },
          holidayHours: { title: 'Horario domingos e feriados', type: 'string', default: 'Dom. e feriados: 09:00 às 15:00' },
          image: { title: 'Imagem da loja', type: 'string', widget: { 'ui:widget': 'image-uploader' } },
        },
      },
    },
  },
}

export default NossasUnidades
