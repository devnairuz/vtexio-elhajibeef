import { useProduct } from "vtex.product-context"

import PriceLabel from "./PriceLabel";

import { getProductPriceInfo } from '../priceUtils'
import styles from './cashPrice.css'

const CashPrice = () => {
  const { product } = useProduct()
  const { bestPrice } = getProductPriceInfo(product)

  if (!bestPrice) {
    return null
  }

  return (
    <div className={styles.cashPriceContainer}>
      <PriceLabel priceValue={bestPrice} />
    </div>
  )
}

export default CashPrice
