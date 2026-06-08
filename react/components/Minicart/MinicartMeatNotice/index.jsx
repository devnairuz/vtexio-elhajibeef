import { useEffect, useMemo, useState } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import styles from './minicartMeatNotice.css'

const KG_SPEC = 'Kg do Item'
const PEOPLE_SPEC = 'Pessoas por Porção'

const normalize = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const parseNumber = value => {
  const raw = Array.isArray(value) ? value[0] : value
  const match = String(raw || '').match(/(\d+(?:[,.]\d+)?)/)
  const number = match ? Number(match[1].replace(',', '.')) : 0
  return Number.isFinite(number) ? number : 0
}

const parseKg = value => {
  const text = String(Array.isArray(value) ? value[0] : value || '').trim()
  return parseNumber(text)
}

const findSpec = (product, specName) => {
  const target = normalize(specName)

  const directKey = Object.keys(product || {}).find(
    key => normalize(key) === target
  )
  if (directKey) {
    const val = product[directKey]
    return Array.isArray(val) ? val[0] : val
  }

  const allSpecs = [
    ...(product?.properties || []),
    ...((product?.specificationGroups || []).flatMap(g => g?.specifications || [])),
    ...(product?.allSpecifications || []).map(name => ({
      name,
      values: product[name],
    })),
  ]

  const found = allSpecs.find(s => normalize(s?.name) === target)
  if (!found) return undefined

  const val = found.values ?? found.value ?? found.Values ?? found.Value
  return Array.isArray(val) ? val[0] : val
}

const getServing = product => ({
  kg: parseKg(findSpec(product, KG_SPEC)),
  people: parseNumber(findSpec(product, PEOPLE_SPEC)),
})

const getItemKey = (item, index) =>
  String(item?.uniqueId || `${item?.productId || ''}-${item?.id || ''}-${index}`)

const formatKg = value => {
  const rounded = Math.round(value * 10) / 10
  const formatted = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toLocaleString('pt-BR')
  return `${formatted}kg`
}

const fetchProduct = productId =>
  fetch(`/api/catalog_system/pub/products/search/?fq=productId:${productId}&_from=0&_to=0`)
    .then(r => r.ok ? r.json() : [])
    .catch(() => [])

const MinicartMeatNotice = () => {
  let items = []
  const [servings, setServings] = useState({})

  try {
    const { orderForm } = useOrderForm()
    items = orderForm?.items ?? []
  } catch (_) {}

  const signature = useMemo(
    () => items
      .map((item, index) => `${getItemKey(item, index)}:${item?.productId || ''}:${item?.id || ''}:${item?.quantity || 0}`)
      .join('|'),
    [items]
  )

  useEffect(() => {
    const mapped = items
      .map((item, index) => ({
        item,
        key: getItemKey(item, index),
        productId: String(item?.productId || ''),
      }))
      .filter(x => x.productId)

    if (!mapped.length) {
      setServings({})
      return undefined
    }

    let active = true

    Promise.all(
      mapped.map(({ key, productId }) =>
        fetchProduct(productId).then(products => [key, getServing(products?.[0])])
      )
    ).then(entries => {
      if (!active) return
      setServings(
        entries.reduce((acc, [key, serving]) => ({ ...acc, [key]: serving }), {})
      )
    })

    return () => { active = false }
  }, [signature])

  const totals = useMemo(
    () => items.reduce((acc, item, index) => {
      const serving = servings[getItemKey(item, index)]
      const qty = Number(item?.quantity) || 0
      if (!serving || qty <= 0) return acc
      return {
        kg: acc.kg + serving.kg * qty,
        people: acc.people + serving.people * qty,
      }
    }, { kg: 0, people: 0 }),
    [items, servings]
  )

  if (!items.length || (totals.kg <= 0 && totals.people <= 0)) return null

  return (
    <div className={styles.notice}>
      <span className={styles.icon} aria-hidden="true">
      </span>
      <span className={styles.text}>
        {`Essa quantidade de carne (${formatKg(totals.kg)}) atende at\u00e9\u00a0`}
        <strong>{`${Math.round(totals.people)}\u00a0pessoas`}</strong>
      </span>
    </div>
  )
}

export default MinicartMeatNotice
