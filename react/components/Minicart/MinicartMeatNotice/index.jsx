import { useMemo } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import styles from './minicartMeatNotice.css'

const getItemWeightKg = (item) => {
  const unitMultiplier = Number(item?.unitMultiplier)
  const quantity = Number(item?.quantity) || 0
  const measurementUnit = String(item?.measurementUnit || '').toLowerCase()

  if (Number.isFinite(unitMultiplier) && unitMultiplier > 0) {
    if (measurementUnit === 'kg') return unitMultiplier * quantity
    if (measurementUnit === 'g') return (unitMultiplier / 1000) * quantity
  }

  const text = `${item?.name || ''} ${item?.skuName || ''}`
  const match = text.match(/(\d+(?:[,.]\d+)?)\s*(kg|g)\b/i)

  if (!match) return 0

  const amount = Number(match[1].replace(',', '.'))
  if (!Number.isFinite(amount)) return 0

  const unit = match[2].toLowerCase()
  const hasDecimalSeparator = /[,.]/.test(match[1])
  const kg = unit === 'kg' || hasDecimalSeparator ? amount : amount / 1000

  return kg * quantity
}

const formatKg = (value) => {
  if (!value) return '0kg'
  const rounded = Math.round(value * 10) / 10
  return `${Number.isInteger(rounded) ? rounded : rounded.toLocaleString('pt-BR')}kg`
}

const MinicartMeatNotice = () => {
  let items = []

  try {
    const { orderForm } = useOrderForm()
    items = orderForm?.items ?? []
  } catch (_) {}

  const totalKg = useMemo(
    () => items.reduce((total, item) => total + getItemWeightKg(item), 0),
    [items]
  )

  if (!items.length || totalKg <= 0) return null

  const people = Math.max(1, Math.round(totalKg * 2))

  return (
    <div className={styles.notice}>
      <span className={styles.icon} aria-hidden="true">
        <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.5 0C7.1 0 7.58.48 7.58 1.08V5.4H11.3C12.03 5.4 12.52 6.15 12.22 6.82L9.73 12.42C9.39 13.18 8.64 13.68 7.8 13.68H5.2C4.36 13.68 3.61 13.18 3.27 12.42L.78 6.82C.48 6.15.97 5.4 1.7 5.4h3.72V1.08C5.42.48 5.9 0 6.5 0Z" fill="currentColor"/>
          <path d="M2.48 15.12h8.04v1.8H2.48v-1.8Z" fill="currentColor"/>
        </svg>
      </span>
      <span>
        Essa quantidade de carne ({formatKg(totalKg)}) atende até <strong>{people} pessoas</strong>
      </span>
    </div>
  )
}

export default MinicartMeatNotice
