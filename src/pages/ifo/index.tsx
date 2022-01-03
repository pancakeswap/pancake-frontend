import React from 'react'
import { IfoPageLayout } from '../../views/Ifos'
import CurrentIfo from '../../views/Ifos/CurrentIfo'

const CurrentIfoPage = () => {
  return <CurrentIfo />
}

CurrentIfoPage.getLayout = IfoPageLayout

export default CurrentIfoPage
