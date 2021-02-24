import React, { useState, useCallback } from 'react'
import { FallingBunnies, FallingBunniesProps, useKonamiCheatCode } from '@pancakeswap-libs/uikit'

const EasterEgg: React.FC<FallingBunniesProps> = (props) => {
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
