import styles from "./loginLabel.css"

const LoginLabel = ({ greetingTitle = "Entrar ou", greetingSubtitle = "Cadastrar" }) => {

  return (
    <div className={styles.clientGreeting}>
      <p className={styles.greetingText}>{greetingTitle}</p>
      <p className={styles.clientName}>
        <strong>
          <span>{greetingSubtitle}</span>
          <svg xmlns="http://www.w3.org/2000/svg"
            width="12" height="12"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="4"
            strokeLinecap="round" strokeLinejoin="round"
            className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"/></svg>
        </strong>
      </p>
    </div>
  )
}

export default LoginLabel