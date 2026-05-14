import { useProduct } from 'vtex.product-context'

import styles from './variableWeightNotice.css'

const SPECIFICATION_NAME = 'Produto Pes\u00e1vel?'
const NOTICE_TITLE = 'Produto com peso vari\u00e1vel'
const NOTICE_TEXT =
  'Nossos produtos possuem por\u00e7\u00f5es diferentes, pesadas no momento do envio e por isso a cobran\u00e7a pode variar. Se o peso for inferior ao cobrado, vamos fazer o estorno da diferen\u00e7a.'

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

const VariableWeightNotice = () => {
  const { product } = useProduct()
  const value = getSpecificationValue(product)

  if (normalizeText(value) !== 'true') {
    return null
  }

  return (
    <div className={styles.variableWeightNotice}>
      <div className={styles.variableWeightTitle}>
        <svg
          className={styles.variableWeightIcon}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 14.6667C4.3181 14.6667 1.33334 11.6819 1.33334 8C1.33334 4.3181 4.3181 1.33334 8 1.33334C11.6819 1.33334 14.6667 4.3181 14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667ZM7.33334 7.33334V11.3333H8.66667V7.33334H7.33334ZM7.33334 4.66667V6H8.66667V4.66667H7.33334Z"
            fill="currentColor"
          />
        </svg>
        {NOTICE_TITLE}
      </div>
      <p className={styles.variableWeightText}>
        {NOTICE_TEXT}
      </p>
    </div>
  )
}

export default VariableWeightNotice
