import React from 'react'
import { useFarms, FarmsPage } from '../context/farmsContext.bmp'
import Farms from 'pages/farms/index.bmp'
import History from 'pages/farms/history.bmp'

export const FarmsWrapper = () => {
  const {
    state: { page },
  } = useFarms()
  switch (page) {
    case FarmsPage.Farms:
      return <Farms />
    case FarmsPage.History:
      return <History />
    default:
      return null
  }
}
