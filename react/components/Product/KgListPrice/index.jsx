import { useProduct } from 'vtex.product-context'

import {
  formatPrice,
  getDisplayKgPrice,
  getKgSpecificationPrice,
  getProductPriceInfo,
  isVariableWeightProduct,
} from '../priceUtils'
import styles from './kgListPrice.css'

const KgListPrice = () => {
  const { product } = useProduct()
  const isVariableWeight = isVariableWeightProduct(product)

  if (isVariableWeight) {
    const kgPrice = getKgSpecificationPrice(product)
    const displayKgPrice = getDisplayKgPrice(product)
    const value = formatPrice(kgPrice)

    if (!value || !displayKgPrice || kgPrice <= displayKgPrice) {
      return null
    }

    return (
      <div className={styles.kgListPrice}>
        {value}/kg
      </div>
    )
  }

  const { bestPrice, listPrice } = getProductPriceInfo(product)
  const value = formatPrice(listPrice)

  if (!value || listPrice <= bestPrice) {
    return null
  }

  return (
    <div className={styles.kgListPrice}>
      {value}
    </div>
  )
}

export default KgListPrice
