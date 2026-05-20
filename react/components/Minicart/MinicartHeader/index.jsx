import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { getCartItemsCount } from '../cartUtils'
import styles from './minicartHeader.css'

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

const MinicartHeader = () => {
  let items = []

  try {
    const { orderForm } = useOrderForm()
    items = orderForm?.items ?? []
  } catch (_) {
    // contexto não disponível, mantém array vazio
  }

  const count = getCartItemsCount(items)
  const countLabel = count === 1 ? '1 item' : `${count} itens`

  return (
    <div className={styles.header}>
      <span className={styles.iconWrapper}>
        <CartIcon />
      </span>
      <span className={styles.title}>
        Carrinho <span className={styles.count}>({countLabel})</span>
      </span>
    </div>
  )
}

export default MinicartHeader
