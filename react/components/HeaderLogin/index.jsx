import { useRenderSession } from 'vtex.session-client'

import LoginLabel from './LoginLabel'

import styles from "./headerLogin.css"

const HeaderLogin = ({ children }) => {
  const { loading, error } = useRenderSession()

  if (loading) {
    return <LoginLabel />
  }

  if (error) {
    return <LoginLabel />
  }

  return (
    <div className={styles.headerLogin}>
      <LoginLabel />

      <div className={styles.loginForm}>
        {children}
      </div>
    </div>
  )
}

export default HeaderLogin
