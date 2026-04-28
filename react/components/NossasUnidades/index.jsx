import React, { useCallback, useState } from 'react'
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

const ITEMS_PER_PAGE = {
  desktop: 4,
  tablet: 3,
  phone: 1,
}

const NossasUnidades = ({ stores }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const storeItems = stores?.length ? stores : DEFAULT_STORES

  const getItemsPerPage = useCallback(() => {
    if (typeof window === 'undefined') return ITEMS_PER_PAGE.desktop
    if (window.innerWidth < 640) return ITEMS_PER_PAGE.phone
    if (window.innerWidth < 1024) return ITEMS_PER_PAGE.tablet

    return ITEMS_PER_PAGE.desktop
  }, [])

  const itemsPerPage = getItemsPerPage()
  const maxIndex = Math.max(0, storeItems.length - itemsPerPage)
  const translateX = -(currentIndex * (100 / itemsPerPage))

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1))
  }

  return (
    <section className={styles.nossasUnidades}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>El Haji Beef</span>
        <h2 className={styles.title}>Nossas Unidades</h2>
      </div>

      <div className={styles.sliderContainer}>
        <button
          aria-label="Anterior"
          className={`${styles.arrowButton} ${styles.arrowPrev}`}
          disabled={currentIndex === 0}
          onClick={handlePrev}
          type="button"
        >
          &#8592;
        </button>

        <div className={styles.sliderViewport}>
          <div
            className={styles.sliderTrack}
            style={{
              transform: `translateX(${translateX}%)`,
              width: `${(storeItems.length / itemsPerPage) * 100}%`,
            }}
          >
            {storeItems.map((store, index) => (
              <article
                className={styles.storeCard}
                key={`${store.name}-${index}`}
                style={{ width: `${100 / storeItems.length}%` }}
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
                    <span
                      aria-hidden="true"
                      className={`${styles.storeIcon} ${styles.locationIcon}`}
                    />
                    <p className={styles.storeText}>{store.address}</p>
                  </div>

                  <div className={styles.storeInfo}>
                    <span
                      aria-hidden="true"
                      className={`${styles.storeIcon} ${styles.clockIcon}`}
                    />
                    <p className={styles.storeText}>
                      {store.openingHours}
                      {store.holidayHours && (
                        <>
                          <br />
                          {store.holidayHours}
                        </>
                      )}
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
          &#8594;
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
          name: {
            title: 'Nome da loja',
            type: 'string',
            default: 'Moema',
          },
          address: {
            title: 'Endereco',
            type: 'string',
            default: 'Alameda dos Nhambiquaras, 801, Moema, Sao Paulo - SP, 04090',
          },
          openingHours: {
            title: 'Horario principal',
            type: 'string',
            default: 'Seg. a sab.: 09:00 as 18:00',
          },
          holidayHours: {
            title: 'Horario domingos e feriados',
            type: 'string',
            default: 'Dom. e feriados: 09:00 as 15:00',
          },
          image: {
            title: 'Imagem da loja',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
        },
      },
    },
  },
}

export default NossasUnidades
