import React, { useContext } from 'react'
import { useProduct } from 'vtex.product-context'
import ProductSummaryContext from 'vtex.product-summary/ProductSummaryContext'

import styles from './productAvailabilityGate.css'

const getOfferAvailability = offer => {
  if (!offer) return false

  if (typeof offer.IsAvailable === 'boolean') {
    return offer.IsAvailable
  }

  return Number(offer.AvailableQuantity || 0) > 0
}

const getItemAvailability = item => {
  const sellers = item?.sellers || []

  return sellers.some(seller => getOfferAvailability(seller?.commertialOffer))
}

const isProductAvailable = product => {
  const selectedItem = product?.selectedItem

  if (selectedItem) {
    return getItemAvailability(selectedItem)
  }

  const items = product?.items || []

  return items.some(getItemAvailability)
}

const ProductAvailabilityGate = ({
  children,
  message = 'Produto indisponivel',
  showMessage = true,
}) => {
  const productSummary = useContext(ProductSummaryContext)
  const productContext = useProduct() || {}
  const product = productContext.product || productSummary?.product

  if (!product) {
    return <>{children}</>
  }

  if (!isProductAvailable(product)) {
    if (!showMessage) {
      return null
    }

    return (
      <div className={styles.unavailableMessage}>
        {message}
      </div>
    )
  }

  return <>{children}</>
}

export default ProductAvailabilityGate
