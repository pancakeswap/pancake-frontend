import React from 'react'
import { ifosConfig } from 'config/constants'
import IfoV2Card from './components/IfoV2Card'
import IfoCardLayout from './components/IfoCardLayout'
import IfoSteps from './components/IfoSteps'
import IfoQuestions from './components/IfoQuestions'

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const Ifo = () => {
  return (
    <IfoCardLayout>
      <IfoV2Card ifo={activeIfo} isInitiallyVisible />
      <IfoSteps currency={activeIfo.currency} />
      <IfoQuestions />
    </IfoCardLayout>
  )
}

export default Ifo
