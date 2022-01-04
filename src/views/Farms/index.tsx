import React, { useState, useEffect } from 'react'
import Farms, { FarmsContext } from './Farms'

export const FarmsPageLayout = (page) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <Farms>{page}</Farms>
}

export { FarmsContext }
