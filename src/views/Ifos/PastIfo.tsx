import React from 'react'
import { ifosConfig } from 'config/constants'
import { Ifo } from 'config/constants/types'
import IfoCardV2Data from './components/IfoCardV2Data'
import IfoCardV1Data from './components/IfoCardV1Data'
import IfoLayout from './components/IfoLayout'

const inactiveIfo: Ifo[] = ifosConfig.filter((ifo) => !ifo.isActive)

const PastIfo = () => {
  return (
    <IfoLayout>
      {inactiveIfo.map((ifo) =>
        ifo.version === 1 ? (
          <IfoCardV1Data key={ifo.id} ifo={ifo} />
        ) : (
          <IfoCardV2Data key={ifo.id} ifo={ifo} isInitiallyVisible={false} />
        ),
      )}
    </IfoLayout>
  )
}

export default PastIfo
