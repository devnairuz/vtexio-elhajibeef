import styles from "./loginLabel.css"

const LoginLabel = ({
  greetingTitle = "Minha Conta",
  greetingSubtitle,
  href = "/login",
  iconOnly = false,
}) => {

  return (
    <a
      href={href}
      className={`${styles.loginLink} ${iconOnly ? styles.loginLinkIconOnly : ''}`}
      aria-label={greetingTitle}
    >
      {iconOnly ? (
        <span className={styles.loginIcon} aria-hidden="true" />
      ) : (
        <div className={styles.clientGreeting}>
          <p className={styles.clientName}>
            <span>{greetingSubtitle || greetingTitle}</span>
          </p>
        </div>
      )}
    </a>
  )
}

export default LoginLabel
