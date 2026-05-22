import { useContext } from 'react'
import ProductSummaryContext from 'vtex.product-summary/ProductSummaryContext'

import {
  formatPrice,
  getDisplayPrice,
  isVariableWeightProduct,
} from '../priceUtils'
import styles from './productSummaryPrice.css'

const ProductSummaryPrice = () => {
  const productSummary = useContext(ProductSummaryContext)
  const product = productSummary?.product
  const price = formatPrice(getDisplayPrice(product))
  const isVariableWeight = isVariableWeightProduct(product)

  if (!price) {
    return null
  }

  return (
    <span className={styles.productSummaryPrice}>
      {price}
      {isVariableWeight ? '/kg' : ''}
    </span>
  )
}

export default ProductSummaryPrice
