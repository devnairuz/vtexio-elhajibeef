import { useState, useEffect } from 'react'
import { useProduct } from 'vtex.product-context'

import styles from './infoTabs.css'

const PREPARATION_SPECIFICATION_NAME = 'Sugest\u00e3o de preparo'

const preparationIconClasses = {
  assado: 'preparationTagIconAssado',
  grelhado: 'preparationTagIconGrelhado',
  cozido: 'preparationTagIconCozido',
  'air fryer': 'preparationTagIconAirFryer',
  airfryer: 'preparationTagIconAirFryer',
  frigideira: 'preparationTagIconFrigideira',
}

const normalizeText = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const getPreparationIconClass = value => {
  const iconClassName = preparationIconClasses[normalizeText(value)]

  return iconClassName ? styles[iconClassName] : null
}

const getAccordionPanelClassName = isOpen =>
  `${styles.accordionPanel} ${isOpen ? styles.accordionPanelOpen : ''}`

const getAccordionContainerClassName = isOpen =>
  `${styles.containerInfoTabs} ${isOpen ? styles.containerInfoTabsOpen : ''}`

const InfoTabs = ({ children, imageDescription }) => {
  const { product } = useProduct()

  const productDescription = product?.description
  const productId = product?.cacheId
  const productSpecificationGroups = product?.specificationGroups ?? []

  const [productSpecifications, setProductSpecifications] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    if (!productSpecificationGroups.length) {
      setProductSpecifications([])
      return
    }

    const specificationsIndex = productSpecificationGroups.findIndex(
      ({ name }) => name === 'allSpecifications'
    )

    if (specificationsIndex === -1) {
      setProductSpecifications([])
      return
    }

    const specificationsGroup =
      productSpecificationGroups[specificationsIndex].specifications ?? []

    setProductSpecifications(specificationsGroup)
  }, [productId, productSpecificationGroups])

  const toggleMapAccordion = (index) => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index))
  }

  return (
    <>
      {productDescription && (
        <div className={getAccordionContainerClassName(activeIndex === 'descricao')}>
          <button
            type="button"
            id="tab-descricao"
            className={styles.headerAccordion}
            onClick={() => toggleMapAccordion('descricao')}
            aria-expanded={activeIndex === 'descricao'}
            aria-controls="panel-descricao"
          >
            <span className={styles.buttonContent}>Sobre o produto</span>
            <svg
              style={activeIndex === 'descricao' ? { transform: 'rotate(180deg)' } : {}}
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="#F3F3F3"
            >
              <path d="M11.8337 1.16667L6.00033 7L0.166992 1.16667L1.20241 0.131249L6.00033 4.92917L10.7982 0.131249L11.8337 1.16667Z" fill="#F3F3F3" />
            </svg>
          </button>
          <div
            id="panel-descricao"
            className={getAccordionPanelClassName(activeIndex === 'descricao')}
            aria-hidden={activeIndex !== 'descricao'}
          >
            <div className={styles.accordionPanelInner}>
              <div className={styles.containerImageDescription}>
                <div dangerouslySetInnerHTML={{ __html: productDescription }} />
                {imageDescription && (
                  <img
                    src={imageDescription.src}
                    alt={imageDescription.alt}
                    title={imageDescription.title}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {productSpecifications.length > 0 &&
        productSpecifications.map((specification, index) => {
          const isPreparationSpecification =
            normalizeText(specification.name) === normalizeText(PREPARATION_SPECIFICATION_NAME)

          return (
            <div
              className={getAccordionContainerClassName(activeIndex === index)}
              key={specification.name || index}
            >
              <button
                type="button"
                id={`tab-${specification.name.toLowerCase()}`}
                className={styles.headerAccordion}
                onClick={() => toggleMapAccordion(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`panel-${index}`}
              >
                <span className={styles.buttonContent}>{specification.name}</span>
                <svg
                  style={activeIndex === index ? { transform: 'rotate(180deg)' } : {}}
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="#F3F3F3"
                >
                  <path d="M11.8337 1.16667L6.00033 7L0.166992 1.16667L1.20241 0.131249L6.00033 4.92917L10.7982 0.131249L11.8337 1.16667Z" fill="#F3F3F3" />
                </svg>
              </button>
              <div
                id={`panel-${index}`}
                className={getAccordionPanelClassName(activeIndex === index)}
                aria-hidden={activeIndex !== index}
              >
                <div className={styles.accordionPanelInner}>
                  <div className={styles.contentTab}>
                    {isPreparationSpecification ? (
                      <div className={styles.preparationTags}>
                        {specification.values?.map((value, valueIndex) => {
                          const iconClassName = getPreparationIconClass(value)

                          return (
                            <span
                              key={`${value}-${valueIndex}`}
                              className={styles.preparationTag}
                            >
                              {iconClassName && (
                                <span
                                  className={`${styles.preparationTagIcon} ${iconClassName}`}
                                  aria-hidden="true"
                                />
                              )}
                              {value}
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: specification.values?.join('<br />'),
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
    </>
  )
}

InfoTabs.schema = {
  title: 'Imagem da Descri\u00e7\u00e3o do Produto',
  type: 'object',
  properties: {
    imageDescription: {
      title: 'Image Prop',
      type: 'object',
      properties: {
        src: {
          type: 'string',
          title: 'Image URL',
          description: 'URL image',
        },
        alt: {
          type: 'string',
          title: 'Image Text Alternative',
        },
        title: {
          type: 'string',
          title: 'Attribute title',
        },
      },
    },
  },
}

export default InfoTabs
