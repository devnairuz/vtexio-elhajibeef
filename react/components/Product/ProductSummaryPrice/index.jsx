import { useContext } from 'react'
import ProductSummaryContext from 'vtex.product-summary/ProductSummaryContext'

import styles from './productSummaryPrice.css'

const VARIABLE_WEIGHT_SPECIFICATION_NAME = 'Produto Pes\u00e1vel?'

const normalizeText = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const getSpecificationValue = (product, specificationName) => {
  const targetName = normalizeText(specificationName)

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

const formatPrice = value => {
  const price = Number(value)

  if (!Number.isFinite(price) || price <= 0) {
    return null
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

const getProductPrice = product => {
  const selectedItem = product?.selectedItem || product?.items?.[0]
  const offer = selectedItem?.sellers?.[0]?.commertialOffer

  return (
    offer?.Price ||
    product?.priceRange?.sellingPrice?.lowPrice ||
    product?.priceRange?.sellingPrice?.highPrice
  )
}

const ProductSummaryPrice = () => {
  const productSummary = useContext(ProductSummaryContext)
  const product = productSummary?.product
  const price = formatPrice(getProductPrice(product))
  const isVariableWeight =
    normalizeText(getSpecificationValue(product, VARIABLE_WEIGHT_SPECIFICATION_NAME)) === 'true'

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
