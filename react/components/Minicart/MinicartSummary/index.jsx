import { useOrderForm } from 'vtex.order-manager/OrderForm'
import styles from './minicartSummary.css'

const FREE_SHIPPING_THRESHOLD = 50000

const formatCurrency = (valueInCents) => {
  const value = (valueInCents || 0) / 100
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const getSubtotal = (orderForm) => {
  const t = orderForm?.totalizers?.find((t) => t.id === 'Items')
  return t?.value ?? 0
}

const getTotal = (orderForm) => orderForm?.value ?? 0

const getFreeShippingProgress = (subtotal) =>
  Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))

const getFreeShippingRemaining = (subtotal) =>
  Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

const TruckIcon = () => (
  <svg width="31" height="16" viewBox="0 0 31 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.06155 15.9722C7.89981 15.9722 6.91234 15.6811 6.09912 15.0987C5.2859 14.5164 4.8793 13.8093 4.8793 12.9774H1.39408L2.02142 10.9809H5.95971C6.3547 10.6648 6.8194 10.4194 7.3538 10.2447C7.8882 10.07 8.45745 9.98264 9.06155 9.98264C9.66565 9.98264 10.2349 10.07 10.7693 10.2447C11.3037 10.4194 11.7684 10.6648 12.1634 10.9809H17.9837L20.9113 1.99653H5.64604L5.78545 1.57227C5.92486 1.10641 6.24434 0.727901 6.74388 0.43674C7.24343 0.14558 7.83011 0 8.50392 0H24.3965L23.107 3.99306H27.1847L31.3669 7.98611L29.9728 12.9774H27.1847C27.1847 13.8093 26.778 14.5164 25.9648 15.0987C25.1516 15.6811 24.1641 15.9722 23.0024 15.9722C21.8407 15.9722 20.8532 15.6811 20.04 15.0987C19.2267 14.5164 18.8201 13.8093 18.8201 12.9774H13.2438C13.2438 13.8093 12.8372 14.5164 12.024 15.0987C11.2108 15.6811 10.2233 15.9722 9.06155 15.9722ZM21.5038 8.98438H28.2302L28.3696 8.46029L25.7906 5.98958H22.4796L21.5038 8.98438ZM20.8416 2.17122L20.9113 1.99653L17.9837 10.9809L18.0534 10.8062L19.2384 7.16254L20.8416 2.17122ZM0 9.30881L0.697042 7.31228H8.36451L7.66747 9.30881H0ZM2.78817 5.66515L3.48521 3.66862H12.5468L11.8497 5.66515H2.78817ZM9.06155 13.9757C9.45654 13.9757 9.78764 13.88 10.0548 13.6887C10.322 13.4974 10.4556 13.2603 10.4556 12.9774C10.4556 12.6946 10.322 12.4575 10.0548 12.2662C9.78764 12.0748 9.45654 11.9792 9.06155 11.9792C8.66656 11.9792 8.33546 12.0748 8.06826 12.2662C7.80106 12.4575 7.66747 12.6946 7.66747 12.9774C7.66747 13.2603 7.80106 13.4974 8.06826 13.6887C8.33546 13.88 8.66656 13.9757 9.06155 13.9757ZM23.0024 13.9757C23.3974 13.9757 23.7285 13.88 23.9957 13.6887C24.2629 13.4974 24.3965 13.2603 24.3965 12.9774C24.3965 12.6946 24.2629 12.4575 23.9957 12.2662C23.7285 12.0748 23.3974 11.9792 23.0024 11.9792C22.6074 11.9792 22.2763 12.0748 22.0091 12.2662C21.7419 12.4575 21.6083 12.6946 21.6083 12.9774C21.6083 13.2603 21.7419 13.4974 22.0091 13.6887C22.2763 13.88 22.6074 13.9757 23.0024 13.9757Z" fill="white"/>
  </svg>
)

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.5208 8.90417 12.7125 8.7125C12.9042 8.52083 13 8.28333 13 8C13 7.71667 12.9042 7.47917 12.7125 7.2875C12.5208 7.09583 12.2833 7 12 7C11.7167 7 11.4792 7.09583 11.2875 7.2875C11.0958 7.47917 11 7.71667 11 8C11 8.28333 11.0958 8.52083 11.2875 8.7125C11.4792 8.90417 11.7167 9 12 9ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="currentColor" />
  </svg>
)

const MinicartSummary = () => {
  let orderForm = null

  try {
    const ctx = useOrderForm()
    orderForm = ctx?.orderForm ?? null
  } catch (_) {}

  const subtotal = getSubtotal(orderForm)
  const total = getTotal(orderForm)
  const progress = getFreeShippingProgress(subtotal)
  const remaining = getFreeShippingRemaining(subtotal)
  const freeShipping = remaining === 0

  return (
    <div className={styles.wrapper}>
      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.label}>Total:</span>
          <span className={styles.value}>{formatCurrency(subtotal)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Entrega:</span>
          <span className={styles.valueLight}>A calcular</span>
        </div>
        <div className={`${styles.row} ${styles.rowTotal}`}>
          <span className={styles.labelTotal}>Total:</span>
          <span className={styles.valueTotal}>{formatCurrency(total)}</span>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.infoText}>
        <span className={styles.infoIcon}><InfoIcon /></span>
        <span>Informações de frete e prazo de entrega serão adicionadas no Check-out.</span>
      </div>

      <div className={styles.capsule}>
        <div className={styles.fill} style={{ width: `${Math.max(progress, 15)}%` }} />
        <span className={styles.truckBadge}><TruckIcon /></span>
        <span className={styles.capsuleText}>
          {freeShipping
            ? 'Você ganhou frete grátis!'
            : <>Com mais <strong>{formatCurrency(remaining)}</strong> o frete é grátis para Grande São Paulo</>}
        </span>
      </div>
    </div>
  )
}

export default MinicartSummary
