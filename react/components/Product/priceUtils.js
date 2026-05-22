const KG_PRICE_SPECIFICATION_NAMES = ['Preco do KG', 'Pre\u00e7o do KG']
const VARIABLE_WEIGHT_SPECIFICATION_NAME = 'Produto Pes\u00e1vel?'

export const normalizeText = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

export const getSpecificationValue = (product, specificationName) => {
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

export const parsePrice = value => {
  if (typeof value === 'number') return value

  const text = String(value || '')
  const normalized = text.includes(',')
    ? text
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
    : text
    .replace(/[^\d,.-]/g, '')

  const price = Number(normalized)

  return Number.isFinite(price) ? price : null
}

export const formatPrice = value => {
  const price = Number(value)

  if (!Number.isFinite(price) || price <= 0) {
    return null
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export const getOffer = product => {
  const selectedItem = product?.selectedItem || product?.items?.[0]

  return selectedItem?.sellers?.[0]?.commertialOffer
}

export const isVariableWeightProduct = product =>
  normalizeText(getSpecificationValue(product, VARIABLE_WEIGHT_SPECIFICATION_NAME)) === 'true'

export const getKgSpecificationPrice = product => {
  const value = KG_PRICE_SPECIFICATION_NAMES
    .map(name => getSpecificationValue(product, name))
    .find(Boolean)

  return parsePrice(value)
}

export const getPaymentDiscountPercent = offer =>
  (offer?.teasers || []).reduce((max, teaser) => {
    const name = normalizeText(teaser?.name)

    if (!name.includes('pix') && !name.includes('boleto')) return max

    const percent = (teaser?.effects?.parameters || []).reduce((current, param) => {
      if (param?.name !== 'PercentualDiscount') return current

      const value = parseFloat(param?.value)

      return Number.isFinite(value) ? Math.max(current, value) : current
    }, 0)

    return Math.max(max, percent)
  }, 0)

export const getProductPriceInfo = product => {
  const offer = getOffer(product)
  const rangePrice =
    product?.priceRange?.sellingPrice?.lowPrice ||
    product?.priceRange?.sellingPrice?.highPrice
  const sellingPrice = Number(offer?.Price || rangePrice || 0)
  const listPrice = Number(offer?.ListPrice || 0)
  const spotPrice = Number(offer?.spotPrice || 0)
  const discountPercent = getPaymentDiscountPercent(offer)
  const teaserPrice = sellingPrice > 0 && discountPercent > 0
    ? sellingPrice * (1 - discountPercent / 100)
    : 0
  const candidates = [sellingPrice, spotPrice, teaserPrice].filter(
    price => Number.isFinite(price) && price > 0
  )
  const bestPrice = candidates.length ? Math.min(...candidates) : 0
  const regularReference =
    listPrice > sellingPrice && sellingPrice > 0 ? listPrice : sellingPrice

  return {
    bestPrice,
    discountPercent,
    listPrice,
    regularReference,
    sellingPrice,
    spotPrice,
    teaserPrice,
    hasPromotion:
      bestPrice > 0 &&
      (
        (listPrice > 0 && bestPrice < listPrice) ||
        (sellingPrice > 0 && bestPrice < sellingPrice)
      ),
  }
}

export const getDisplayKgPrice = product => {
  const kgPrice = getKgSpecificationPrice(product)

  if (!kgPrice) return null

  const { bestPrice, regularReference } = getProductPriceInfo(product)

  if (bestPrice > 0 && regularReference > 0 && bestPrice < regularReference) {
    return kgPrice * (bestPrice / regularReference)
  }

  return kgPrice
}

export const getDisplayPrice = product => {
  if (isVariableWeightProduct(product)) {
    return getDisplayKgPrice(product)
  }

  return getProductPriceInfo(product).bestPrice
}
