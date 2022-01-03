import React from 'react'
import { InfoPageLayout } from 'views/Info'
import Overview from 'views/Info/Overview'

const InfoPage = () => {
  return <Overview />
}

InfoPage.getLayout = InfoPageLayout

export default InfoPage
