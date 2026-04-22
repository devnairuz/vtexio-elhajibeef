import { useState, useEffect } from 'react';
import { useProduct } from 'vtex.product-context';

import styles from './infoTabs.css'

const InfoTabs = () => {
  const productContext = useProduct();
  const product = productContext?.product
  const productId = productContext?.product?.cacheId

  const [productSpecifications, setProductSpecifications] = useState({
    activeSpecification: null,
    specificationsTabs: null,
    specificationContent: null
  })

  const [openTabHeader, setOpenTabHeader] = useState(false)

  useEffect(() => {
    const specifications = product?.properties

    setProductSpecifications({
      activeSpecification: 0,
      specificationsTabs: specifications,
      specificationContent: specifications[0]?.values[0]
    })
    setOpenTabHeader(false);
  }, [productId])

  const handleBtnControl = ( tabIndex ) => {
    setProductSpecifications(prevState => {
      return {
        ...prevState,
        activeSpecification: tabIndex,
        specificationContent: prevState.specificationsTabs[tabIndex]?.values[0]
      }
    })
    setOpenTabHeader(!openTabHeader)
  }

  if (!product?.properties?.length) return null

  return (
    <>
      {productSpecifications.specificationsTabs?.length > 0 && (
      <div className={styles.productInfoTabs}>
        <div className={openTabHeader ? styles.tabHeaderOpen : styles.tabHeader}>
          {productSpecifications.specificationsTabs?.map((info, index) => (
            <button
              type="button"
              onClick={() => handleBtnControl(index)}
              key={info.name}
              data-control-for={info.name}
              className={`${styles.infoControl}${productSpecifications.activeSpecification === index ? ` ${styles.active}`:''}`}>
                {info.name}
              </button>
          ))}
        </div>

        <div
          className={styles.tabContent}
          dangerouslySetInnerHTML={{__html: productSpecifications.specificationContent}}
        />
      </div>
    )}
    </>
  )
}

export default InfoTabs