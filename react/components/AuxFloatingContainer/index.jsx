import { useState, useEffect } from 'react'

import classes from './custom.floating.css'

const AuxFloatingContainer = ({ children }) => {
  const [isAtHome, setIsAtHome] = useState(true)

  useEffect(() => {
    if (window.location.pathname !== '/') {
      setIsAtHome(false)
    }
  }, [window.location])

  return (
    <div className={!isAtHome ? classes.notHomeRoute : classes.homeRoute}>
      {children}
    </div>
  )
}

export { AuxFloatingContainer }
