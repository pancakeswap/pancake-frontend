import React from 'react'
import { useProfile } from 'state/hooks'
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
  const { hasProfile } = useProfile()
  return (
    <IfoCardLayout>
      <IfoV2Card ifo={activeIfo} hasProfile={hasProfile} isInitiallyVisible />
      <IfoSteps hasProfile={hasProfile} currency={activeIfo.currency} />
      <IfoQuestions />
    </IfoCardLayout>
  )
}

export default Ifo
