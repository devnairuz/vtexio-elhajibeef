import { useRenderSession } from 'vtex.session-client'

import LoginLabel from './LoginLabel'

import styles from "./headerLogin.css"

const HeaderLogin = ({ children, iconOnly = false }) => {
  const { session, loading, error } = useRenderSession()

  const isAuthenticated =
    session?.namespaces?.profile?.isAuthenticated?.value === 'true'

  const href = isAuthenticated ? '/account' : '/login'

  if (loading) {
    return <LoginLabel href={href} iconOnly={iconOnly} />
  }

  if (error) {
    return <LoginLabel href={href} iconOnly={iconOnly} />
  }

  return (
    <div className={styles.headerLogin}>
      <LoginLabel href={href} iconOnly={iconOnly} />

      {!iconOnly && (
        <div className={styles.loginForm}>
          {children}
        </div>
      )}
    </div>
  )
}

export default HeaderLogin
