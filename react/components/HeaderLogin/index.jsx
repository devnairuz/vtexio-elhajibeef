import { useRenderSession } from 'vtex.session-client'

import LoginLabel from './LoginLabel'

import styles from "./headerLogin.css"

const HeaderLogin = ({ children }) => {
  const { loading, session, error } = useRenderSession()

  if (loading) {
    return <LoginLabel />
  }

  if (error) {
    return <LoginLabel />
  }

  return (
    <div className={styles.headerLogin}>
      {session?.namespaces?.profile?.firstName?.value ? (
        <LoginLabel
          greetingTitle="Olá"
          greetingSubtitle={session.namespaces.profile.firstName.value}
        />

      ) : (
        <LoginLabel />
      )}

      <div className={styles.loginForm}>
        {children}
      </div>
    </div>
  )
}

export default HeaderLogin