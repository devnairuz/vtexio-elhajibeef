import styles from './minicartContinuar.css'

const MinicartContinuar = () => {
  const handleClick = () => {
    const closeBtn = document.querySelector('[class*="closeIconContainer"] button')
    closeBtn?.click()
  }

  return (
    <button className={styles.continuar} onClick={handleClick}>
      Continuar comprando
    </button>
  )
}

export default MinicartContinuar
