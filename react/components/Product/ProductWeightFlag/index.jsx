import { useContext } from 'react'
import ProductSummaryContext from 'vtex.product-summary/ProductSummaryContext'

import styles from './productWeightFlag.css'

const SPECIFICATION_NAME = 'Produto Pes\u00e1vel?'

const normalizeText = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const getSpecificationValue = product => {
  const targetName = normalizeText(SPECIFICATION_NAME)

  const property = product?.properties?.find(
    item => normalizeText(item?.name) === targetName
  )

  if (property?.values?.length) {
    return property.values[0]
  }

  const specifications = product?.specificationGroups?.flatMap(
    group => group?.specifications || []
  )

  const specification = specifications?.find(
    item => normalizeText(item?.name) === targetName
  )

  return specification?.values?.[0]
}

const ProductWeightFlag = () => {
  const productSummary = useContext(ProductSummaryContext)
  const value = getSpecificationValue(productSummary?.product)

  if (normalizeText(value) !== 'true') {
    return null
  }

  return (
    <div className={styles.productWeightFlag}>
      <span className={styles.productWeightFlagIcon} aria-hidden="true">
        $
      </span>
      <span>Peso variável</span>
    </div>
  )
}

export default ProductWeightFlag
