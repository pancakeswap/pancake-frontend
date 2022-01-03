import React from 'react'
import Farms, { FarmsContext } from './Farms'

export const FarmsPageLayout = (page) => {
  return <Farms>{page}</Farms>
}

export { FarmsContext }
