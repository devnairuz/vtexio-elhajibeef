import { useState } from "react"
import { useProduct } from "vtex.product-context"

import PriceLabel from "./PriceLabel";

import styles from './cashPrice.css'

const CashPrice = () => {
  const [discountValue, setDiscountValue] = useState(0)
  const { selectedItem } = useProduct();
  
  const spotPrice = selectedItem?.sellers[0]?.commertialOffer.spotPrice
  const teasers = selectedItem?.sellers[0]?.commertialOffer?.teasers

  teasers.map(teaser => {
    if(teaser.name.toLowerCase().includes('boleto') || teaser.name.toLowerCase().includes('pix')) {
      teaser.effects.parameters.map(param => {
        if(param.name === "PercentualDiscount" && discountValue === 0) {
          setDiscountValue(parseFloat(param.value))
        }
      })
    }
  })

  const cashPrice = spotPrice - (spotPrice / 100 * discountValue)

  return (
    <div className={styles.cashPriceContainer}>
      {discountValue > 0 ? (
        <PriceLabel priceValue={cashPrice} />
      ) : (
        <PriceLabel priceValue={spotPrice} />
      )}
    </div>
  )
}

export default CashPrice