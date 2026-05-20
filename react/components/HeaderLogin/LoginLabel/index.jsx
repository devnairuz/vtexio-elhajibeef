import styles from "./loginLabel.css"

const LoginLabel = ({ greetingTitle = "Minha Conta", greetingSubtitle, href = "/login" }) => {

  return (
    <a href={href} className={styles.loginLink}>
      <div className={styles.clientGreeting}>
        <p className={styles.clientName}>
          <span>{greetingSubtitle || greetingTitle}</span>
        </p>
      </div>
    </a>
  )
}

export default LoginLabel
