import { useContext } from 'react'
import ProductSummaryContext from 'vtex.product-summary/ProductSummaryContext'

import {
  formatPrice,
  getDisplayKgPrice,
  getKgSpecificationPrice,
  getProductPriceInfo,
  isVariableWeightProduct,
} from '../priceUtils'
import styles from './summaryKgListPrice.css'

const SummaryKgListPrice = () => {
  const productSummary = useContext(ProductSummaryContext)
  const product = productSummary?.product
  const isVariableWeight = isVariableWeightProduct(product)

  if (isVariableWeight) {
    const kgPrice = getKgSpecificationPrice(product)
    const displayKgPrice = getDisplayKgPrice(product)
    const value = formatPrice(kgPrice)

    if (!value || !displayKgPrice || kgPrice <= displayKgPrice) {
      return null
    }

    return (
      <span className={styles.summaryKgListPrice}>
        {value}/kg
      </span>
    )
  }

  const { bestPrice, listPrice } = getProductPriceInfo(product)
  const value = formatPrice(listPrice)

  if (!value || listPrice <= bestPrice) {
    return null
  }

  return (
    <span className={styles.summaryKgListPrice}>
      {value}
    </span>
  )
}

export default SummaryKgListPrice
