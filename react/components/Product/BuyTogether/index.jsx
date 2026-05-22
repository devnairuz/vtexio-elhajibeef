import React, { useState, useMemo, useEffect } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'
import { getProductPriceInfo } from '../priceUtils'
import styles from './buytogether.css'

const CSS_HANDLES = [
  'buyTogetherContainer', 'buyTogetherTitle', 'buyTogetherWrapper',
  'buyTogetherProducts', 'buyTogetherProduct', 'buyTogetherProductImage',
  'buyTogetherProductContent', 'buyTogetherProductHeader', 'buyTogetherProductName',
  'buyTogetherProductPrice', 'buyTogetherPriceHighlight', 'buyTogetherPriceMax',
  'buyTogetherInstallments', 'buyTogetherTotal', 'buyTogetherTotalBlock',
  'buyTogetherTotalPrice', 'buyTogetherButton', 'buyTogetherButtonEl',
  'buyTogetherSeparator', 'buyTogetherSeparatorLine', 'buyTogetherSeparatorIcon',
  'buyTogetherWeightTag', 'buyTogetherWeightTagIcon', 'buyTogetherWeightTagText',
]

const fmt = (price) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price || 0)

const getOffer = (p) => p?.items?.[0]?.sellers?.[0]?.commertialOffer
const getSku = (p) => p?.items?.[0]?.itemId || p?.productId
const getSeller = (p) => p?.items?.[0]?.sellers?.[0]?.sellerId || '1'

const getImageUrl = (p) => {
  const images = p?.items?.[0]?.images || []
  return (
    images.find((img) => img?.imageUrl && !/\.svg(?:\?|$)/i.test(img.imageUrl))?.imageUrl ||
    images[0]?.imageUrl ||
    '/arquivos/no-image.png'
  )
}

const getCartImageUrl = (p) => {
  const url = getImageUrl(p)
  return url.replace(/ids\/(\d+)(?:-\d+-\d+)?/i, 'ids/$1-512-512')
}

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

const isWeightVariable = (p) => {
  const value = getSpecificationValue(p)

  return normalizeText(value) === 'true'
}

const getCashPrice = (p) => {
  const { bestPrice, discountPercent, regularReference } = getProductPriceInfo(p)

  return { base: regularReference, disc: discountPercent, final: bestPrice }
}

const getInstallments = (p, preferred = 10) => {
  const offer = getOffer(p)
  const opts = offer?.Installments || []
  const selected =
    opts.find((o) => o?.NumberOfInstallments === preferred) ||
    [...opts].sort((a, b) => b.NumberOfInstallments - a.NumberOfInstallments)[0]

  if (selected) {
    const count = selected.NumberOfInstallments || preferred
    const total = selected.TotalValuePlusInterestRate || (selected.Value || 0) * count
    return { total, installment: selected.Value || total / count, count }
  }

  const listPrice = offer?.ListPrice
  const cash = getCashPrice(p).final
  const total = listPrice && listPrice >= cash ? listPrice : cash
  return { total, installment: total / preferred, count: preferred }
}

const DollarIcon = () => (
  <svg
    className={styles.buyTogetherWeightTagIcon}
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="5" cy="5" r="4.5" stroke="#F5BE4B" />
    <path
      d="M5.3 7.45v-.46c.36-.05.64-.18.83-.4.2-.21.3-.48.3-.81 0-.35-.1-.62-.31-.82-.2-.2-.51-.36-.93-.5l-.27-.08c-.23-.07-.39-.15-.48-.24a.44.44 0 0 1-.13-.32c0-.16.06-.28.18-.36.13-.09.3-.13.5-.13.19 0 .34.04.46.13.13.08.21.21.26.38l.78-.22a1.2 1.2 0 0 0-.45-.62 1.4 1.4 0 0 0-.74-.27v-.48h-.55v.48c-.36.05-.64.18-.83.4-.2.22-.29.49-.29.82 0 .32.09.58.27.78.18.2.46.36.83.47l.28.09c.27.08.46.17.55.27a.5.5 0 0 1 .13.34c0 .18-.06.31-.19.4-.13.1-.32.14-.55.14-.23 0-.42-.06-.55-.17a.78.78 0 0 1-.27-.46l-.79.21c.07.32.23.57.46.76.24.18.53.29.87.32v.46z"
      fill="#F5BE4B"
    />
  </svg>
)

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7Zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z"
      fill="#CCCCCC"
    />
  </svg>
)

const EqualIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="#CCCCCC" strokeWidth="2" />
    <path d="M7 15v-1.8h10V15H7Zm0-4.2V9h10v1.8H7Z" fill="#CCCCCC" />
  </svg>
)

const WeightTag = () => (
  <span className={styles.buyTogetherWeightTag}>
    <DollarIcon />
    <span className={styles.buyTogetherWeightTagText}>Peso variável</span>
  </span>
)

const Separator = ({ variant }) => (
  <div className={styles.buyTogetherSeparator}>
    <span className={styles.buyTogetherSeparatorLine} />
    <span className={styles.buyTogetherSeparatorIcon}>
      {variant === 'equal' ? <EqualIcon /> : <PlusIcon />}
    </span>
    <span className={styles.buyTogetherSeparatorLine} />
  </div>
)

const BuyTogether = ({ title = 'Não se esqueça' }) => {
  useCssHandles(CSS_HANDLES)
  const { product: mainProduct } = useProduct() || {}
  const { orderForm, setOrderForm } = useOrderForm()
  const [isAdding, setIsAdding] = useState(false)
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!mainProduct?.productId) return
    setLoading(true)

    fetch(`/api/catalog_system/pub/products/crossselling/showtogether/${mainProduct.productId}`)
      .then((r) => r.ok ? r.json() : [])
      .then(async (products) => {
        const unique = products.filter(
          (p, i, arr) =>
            p?.productId &&
            String(p.productId) !== String(mainProduct.productId) &&
            arr.findIndex((x) => String(x?.productId) === String(p.productId)) === i
        )
        if (!unique.length) return setRecommended([])

        const full = await Promise.all(
          unique.map((p) =>
            fetch(`/api/catalog_system/pub/products/search/?fq=productId:${p.productId}`)
              .then((r) => r.ok ? r.json() : [])
              .then((res) => res?.[0] || p)
              .catch(() => p)
          )
        )
        setRecommended(
          full.filter(
            (p) => p?.productId && String(p.productId) !== String(mainProduct.productId)
          )
        )
      })
      .catch(() => setRecommended([]))
      .finally(() => setLoading(false))
  }, [mainProduct?.productId])

  const allProducts = useMemo(() => recommended, [recommended])

  const pricing = useMemo(() => {
    const cards = allProducts.map((p) => ({
      product: p,
      cash: getCashPrice(p),
      inst: getInstallments(p),
    }))

    const withDisplay = cards.map((c) => ({
      ...c,
      displayed: c.cash.final,
    }))

    const totalInst = withDisplay.reduce((s, c) => s + (c.inst.total || 0), 0)
    const totalCash = withDisplay.reduce((s, c) => s + (c.cash.final || 0), 0)
    const minCount = Math.min(...withDisplay.map((c) => c.inst.count || 10).filter(Boolean))

    return {
      cards: withDisplay,
      totalPrice: totalCash,
      totalMax: totalInst,
      totalInstallment: totalInst / minCount,
      installmentCount: minCount,
    }
  }, [allProducts])

  const refreshOrderForm = async () => {
    try {
      const res = await fetch('/api/checkout/pub/orderForm', { credentials: 'include' })
      if (res.ok) { const of = await res.json(); setOrderForm(of); return of }
    } catch (e) { console.error(e) }
    return orderForm
  }

  const addItem = async (formId, product, sku, seller) => {
    try {
      const res = await fetch(`/api/checkout/pub/orderForm/${formId}/items?sc=1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          items: [{ id: String(sku), quantity: 1, seller: String(seller) }],
          marketingData: { salesChannel: '1' },
          itemMetadata: {
            items: [{
              id: String(sku), seller: String(seller),
              name: product?.productName,
              skuName: product?.items?.[0]?.name || product?.productName,
              imageUrl: getImageUrl(product),
              detailUrl: product?.linkText ? `/${product.linkText}/p` : '#',
            }],
          },
        }),
      })
      if (!res.ok) throw new Error()
      const of = await res.json(); setOrderForm(of); return of
    } catch { return null }
  }

  const handleAddToCart = async () => {
    if (!recommended.length || isAdding) return
    setIsAdding(true)
    try {
      const current = await refreshOrderForm()
      const id = current?.id || orderForm?.id
      if (!id) throw new Error('No orderForm id')

      for (const p of recommended) {
        const sku = getSku(p); const seller = getSeller(p)
        const result = await addItem(id, p, sku, seller)
        if (!result) await fetch(`/checkout/cart/add?sku=${sku}&qty=1&seller=${seller}&sc=1`, { credentials: 'include' })
      }

      const latest = await refreshOrderForm()
      const imgMap = recommended.reduce((acc, p) => {
        const sku = String(getSku(p) || '')
        if (sku) acc[sku] = getCartImageUrl(p)
        return acc
      }, {})

      const synced = {
        ...latest,
        items: (latest.items || []).map((item) => {
          const url = imgMap[String(item.id)]
          return url ? { ...item, imageUrl: url, imageUrls: { at1x: url, at2x: url, at3x: url } } : item
        }),
      }

      window.postMessage({ eventName: 'vtex:orderFormUpdated', orderForm: synced }, window.origin)
      window.dispatchEvent(new Event('orderFormUpdated.vtex'))
      window.postMessage({ eventName: 'vtex:addToCart', items: synced.items || [] }, window.origin)
      setOrderForm(synced)

      const btn = document.querySelector('.vtex-minicart-2-x-minicartIconContainer') ||
        document.querySelector('[data-testid="minicart-button"]')
      if (btn) btn.click()
    } catch (e) { console.error(e) }
    finally { setIsAdding(false) }
  }

  if (!mainProduct || !recommended.length || loading) return null

  return (
    <div className={styles.buyTogetherContainer}>
      <div className={styles.buyTogetherWrapper}>
        <h2 className={styles.buyTogetherTitle}>{title}</h2>

        <div className={styles.buyTogetherProducts}>
          {pricing.cards.map(({ product, displayed }, index) => (
            <React.Fragment key={getSku(product)}>
              <div className={styles.buyTogetherProduct}>
                <div className={styles.buyTogetherProductImage}>
                  <img src={getImageUrl(product)} alt={product?.productName} loading="lazy" />
                </div>
                <div className={styles.buyTogetherProductContent}>
                  <h3 className={styles.buyTogetherProductName}>{product?.productName}</h3>
                  <div className={styles.buyTogetherProductPrice}>
                    <strong className={styles.buyTogetherPriceHighlight}>{fmt(displayed)}</strong>
                  </div>
                  {isWeightVariable(product) && <WeightTag />}
                </div>
              </div>

              <Separator variant={index < pricing.cards.length - 1 ? 'plus' : 'equal'} />
            </React.Fragment>
          ))}

          <div className={styles.buyTogetherTotal}>
            <div className={styles.buyTogetherTotalBlock}>
              <strong className={styles.buyTogetherTotalPrice}>{fmt(pricing.totalPrice)}</strong>
              <p className={styles.buyTogetherPriceMax}>Preço máximo: {fmt(pricing.totalMax)}</p>
            </div>
            <p className={styles.buyTogetherInstallments}>
              em até {pricing.installmentCount}x sem juros de <strong>{fmt(pricing.totalInstallment)}</strong>
            </p>
          </div>

          <button
            type="button"
            className={styles.buyTogetherButtonEl}
            disabled={isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? 'Adicionando...' : 'Compre junto'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BuyTogether
