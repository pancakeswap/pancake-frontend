import React, { useState, useCallback } from 'react'
import { FallingBunnies, useKonamiCheatCode } from '@pancakeswap-libs/uikit'

export interface EasterEggProps {
  size?: number
  count?: number
  iterations?: number
  duration?: number
}

const EasterEgg: React.FC<EasterEggProps> = (props) => {
  const [show, setShow] = useState(false)
  const startFalling = useCallback(() => setShow(true), [setShow])
  useKonamiCheatCode(startFalling)

  if (show) {
    return (
      <div onAnimationEnd={() => setShow(false)}>
        <FallingBunnies {...props} />
      </div>
    )
  }
  return null
}

export default EasterEgg
