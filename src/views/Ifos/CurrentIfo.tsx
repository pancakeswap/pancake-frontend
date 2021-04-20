import React from 'react'
import { ifosConfig } from 'config/constants'
import IfoCardV2Data from './components/IfoCardV2Data'
import IfoLayout from './components/IfoLayout'
import IfoSteps from './components/IfoSteps'
import IfoQuestions from './components/IfoQuestions'

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const Ifo = () => {
  return (
    <IfoLayout>
      <IfoCardV2Data ifo={activeIfo} isInitiallyVisible />
      <IfoSteps currency={activeIfo.currency} />
      <IfoQuestions />
    </IfoLayout>
  )
}

export default Ifo
