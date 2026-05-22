import { useProduct } from 'vtex.product-context'

import {
  formatPrice,
  getDisplayKgPrice,
  getProductPriceInfo,
  isVariableWeightProduct,
} from '../priceUtils'
import styles from './kgPrice.css'

const KgPrice = () => {
  const { product } = useProduct()
  const isVariableWeight = isVariableWeightProduct(product)
  const value = formatPrice(
    isVariableWeight ? getDisplayKgPrice(product) : getProductPriceInfo(product).bestPrice
  )

  if (!value) {
    return null
  }

  return (
    <div className={styles.kgPrice}>
      {value}
      {isVariableWeight ? '/kg' : ''}
    </div>
  )
}

export default KgPrice
