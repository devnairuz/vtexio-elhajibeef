import React, { useMemo } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import styles from './headerRuntime.css'

const HeaderRuntime = ({ children }) => {
  const { page = '' } = useRuntime()
  const isHome = useMemo(() => page.startsWith('store.home'), [page])

  return (
    <header className={`${styles.header} ${isHome ? styles.headerHome : styles.headerDefault}`}>
      {children}
    </header>
  )
}

export default HeaderRuntime
