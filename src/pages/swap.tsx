import React, { useEffect, useState } from 'react'
import Swap from '../views/Swap'

const SwapPage = () => {
  const [is, setIs] = useState(false)
  useEffect(() => {
    setIs(true)
  }, [])

  if (is) {
    return <Swap />
  }

  return null
}

export default SwapPage
