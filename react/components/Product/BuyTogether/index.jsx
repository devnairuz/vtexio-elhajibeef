import React, { useState, useMemo, useEffect } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'
import styles from './buytogether.css'

const CSS_HANDLES = [
  'buyTogetherContainer', 'buyTogetherTitle', 'buyTogetherWrapper',
  'buyTogetherProducts', 'buyTogetherProduct', 'buyTogetherProductImage',
  'buyTogetherProductContent', 'buyTogetherProductName', 'buyTogetherProductPrice',
  'buyTogetherPriceHighlight', 'buyTogetherPriceMax', 'buyTogetherInstallments',
  'buyTogetherTotal', 'buyTogetherTotalPrice', 'buyTogetherButton',
  'buyTogetherPlus', 'buyTogetherEqual',
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

const getSpotDiscount = (p) =>
  (getOffer(p)?.teasers || []).reduce((max, t) => {
    const name = t?.name?.toLowerCase() || ''
    if (!name.includes('pix') && !name.includes('boleto')) return max
    const pct = (t?.effects?.parameters || []).reduce((d, param) => {
      if (param?.name !== 'PercentualDiscount') return d
      const v = parseFloat(param?.value)
      return Number.isFinite(v) ? Math.max(d, v) : d
    }, 0)
    return Math.max(max, pct)
  }, 0)

const getCashPrice = (p) => {
  const offer = getOffer(p)
  const base = offer?.Price || p?.priceRange?.sellingPrice?.highPrice || 0
  const disc = getSpotDiscount(p)
  return { base, disc, final: disc > 0 ? base * (1 - disc / 100) : base }
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

    fetch(`/api/catalog_system/pub/products/crossselling/suggestions/${mainProduct.productId}`)
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
        setRecommended(full.filter(Boolean))
      })
      .catch(() => setRecommended([]))
      .finally(() => setLoading(false))
  }, [mainProduct?.productId])

  const allProducts = useMemo(
    () => (mainProduct ? [mainProduct, ...recommended] : []),
    [mainProduct, recommended]
  )

  const pricing = useMemo(() => {
    const cards = allProducts.map((p) => ({
      product: p,
      cash: getCashPrice(p),
      inst: getInstallments(p),
    }))

    const maxDisc = cards.reduce((m, c) => Math.max(m, c.cash.disc || 0), 0)

    const withDisplay = cards.map((c) => ({
      ...c,
      displayed: maxDisc > 0
        ? c.inst.total * (1 - maxDisc / 100)
        : c.cash.final,
    }))

    const totalInst = withDisplay.reduce((s, c) => s + (c.inst.total || 0), 0)
    const totalCash = withDisplay.reduce((s, c) => s + (c.cash.final || 0), 0)
    const minCount = Math.min(...withDisplay.map((c) => c.inst.count || 10).filter(Boolean))

    return {
      cards: withDisplay,
      totalPrice: maxDisc > 0 ? totalInst * (1 - maxDisc / 100) : totalCash,
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
    if (!mainProduct || !recommended.length || isAdding) return
    setIsAdding(true)
    try {
      const current = await refreshOrderForm()
      const id = current?.id || orderForm?.id
      if (!id) throw new Error('No orderForm id')

      for (const p of [mainProduct, ...recommended]) {
        const sku = getSku(p); const seller = getSeller(p)
        const result = await addItem(id, p, sku, seller)
        if (!result) await fetch(`/checkout/cart/add?sku=${sku}&qty=1&seller=${seller}&sc=1`, { credentials: 'include' })
      }

      const latest = await refreshOrderForm()
      const imgMap = [mainProduct, ...recommended].reduce((acc, p) => {
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
          {pricing.cards.map(({ product, displayed, inst }, index) => (
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
                </div>
              </div>

              {index < pricing.cards.length - 1
                ? <div className={styles.buyTogetherPlus}><span>+</span></div>
                : <div className={styles.buyTogetherEqual}><span>=</span></div>
              }
            </React.Fragment>
          ))}

          <div className={styles.buyTogetherTotal}>
            <div className={styles.buyTogetherTotalPrice}>
              <strong className={styles.buyTogetherPriceHighlight}>{fmt(pricing.totalPrice)}</strong>
              <p className={styles.buyTogetherPriceMax}>Preço máximo: {fmt(pricing.totalMax)}</p>
              <p className={styles.buyTogetherInstallments}>
                em até {pricing.installmentCount}x sem juros de {fmt(pricing.totalInstallment)}
              </p>
            </div>
            <div className={styles.buyTogetherButton}>
              <Button variation="primary" size="large" isLoading={isAdding} onClick={handleAddToCart}>
                {isAdding ? 'Adicionando...' : 'Compre junto'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyTogether