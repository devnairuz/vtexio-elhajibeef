import styles from "./loginLabel.css"

const LoginLabel = ({ greetingTitle = "Minha Conta", greetingSubtitle }) => {

  return (
    <div className={styles.clientGreeting}>
      <p className={styles.clientName}>
        <span>{greetingSubtitle || greetingTitle}</span>
      </p>
    </div>
  )
}

export default LoginLabel
