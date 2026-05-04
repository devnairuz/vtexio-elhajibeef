import React, { useState, useEffect } from 'react'
import styles from './nossasUnidades.css'

const DEFAULT_STORES = [
  {
    name: 'Moema',
    address: 'Alameda dos Nhambiquaras, 801, Moema, Sao Paulo - SP, 04090',
    openingHours: 'Seg. a sab.: 09:00 as 18:00',
    holidayHours: 'Dom. e feriados: 09:00 as 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Moema',
    address: 'Alameda dos Nhambiquaras, 801, Moema, Sao Paulo - SP, 04090',
    openingHours: 'Seg. a sab.: 09:00 as 18:00',
    holidayHours: 'Dom. e feriados: 09:00 as 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Moema',
    address: 'Alameda dos Nhambiquaras, 801, Moema, Sao Paulo - SP, 04090',
    openingHours: 'Seg. a sab.: 09:00 as 18:00',
    holidayHours: 'Dom. e feriados: 09:00 as 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
  {
    name: 'Moema',
    address: 'Alameda dos Nhambiquaras, 801, Moema, Sao Paulo - SP, 04090',
    openingHours: 'Seg. a sab.: 09:00 as 18:00',
    holidayHours: 'Dom. e feriados: 09:00 as 15:00',
    image: 'assets/nossas-unidades/card-loja.png',
  },
]

const getItemsPerPage = () => {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 3
  return 4
}

const NossasUnidades = ({ stores }) => {
  const storeItems = stores?.length ? stores : DEFAULT_STORES

  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage)

  // Atualiza itemsPerPage ao redimensionar a janela
  useEffect(() => {
    const handleResize = () => {
      const next = getItemsPerPage()
      setItemsPerPage(prev => {
        if (prev !== next) setCurrentIndex(0) // reset ao mudar breakpoint
        return next
      })
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, storeItems.length - itemsPerPage)

  // Porcentagem baseada no viewport do slider, não no track inteiro
  const cardWidthPercent = 100 / itemsPerPage
  const translateX = -(currentIndex * cardWidthPercent)

  const handlePrev = () => setCurrentIndex(prev => Math.max(0, prev - 1))
  const handleNext = () => setCurrentIndex(prev => Math.min(maxIndex, prev + 1))

  return (
    <section className={styles.nossasUnidades}>
      <div className={styles.headerunidades}>
        <span className={styles.eyebrow}> NOSSAS UNIDADES</span>
        <h2 className={styles.title}>Localize a unidade El Haji Beef mais próxima para descobrir a excelência de nossos cortes exclusivos. Nossas boutiques unem a tradição da Fazenda São João à alta tecnologia: garantindo um atendimento especializado e o rigor do padrão 100% Halal em cada escolha.</h2>
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

        <div className={styles.sliderViewport}>
          <div
            className={styles.sliderTrack}
            style={{ transform: `translateX(${translateX}%)` }}
          >
            {storeItems.map((store, index) => (
              <article
                className={styles.storeCard}
                key={`${store.name}-${index}`}
                style={{ width: `${cardWidthPercent}%`, flexShrink: 0 }}
              >
                <img
                  alt={`Loja ${store.name}`}
                  className={styles.storeImage}
                  src={store.image}
                />
                <div className={styles.storeOverlay}>
                  <span className={styles.storeLabel}>Loja</span>
                  <h3 className={styles.storeName}>{store.name}</h3>
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
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            aria-label={`Ir para slide ${i + 1}`}
            className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
            key={i}
            onClick={() => setCurrentIndex(i)}
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
          address: { title: 'Endereco', type: 'string', default: 'Alameda dos Nhambiquaras, 801, Moema, Sao Paulo - SP, 04090' },
          openingHours: { title: 'Horario principal', type: 'string', default: 'Seg. a sab.: 09:00 as 18:00' },
          holidayHours: { title: 'Horario domingos e feriados', type: 'string', default: 'Dom. e feriados: 09:00 as 15:00' },
          image: { title: 'Imagem da loja', type: 'string', widget: { 'ui:widget': 'image-uploader' } },
        },
      },
    },
  },
}

export default NossasUnidades
