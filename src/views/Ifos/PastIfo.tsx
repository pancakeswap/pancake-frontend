import React from 'react'
import { ifosConfig } from 'config/constants'
import { Ifo } from 'config/constants/types'
import IfoCardV2Data from './components/IfoCardV2Data'
import IfoCardV1Data from './components/IfoCardV1Data'
import IfoCardV3Data from './components/IfoCardV3Data'
import IfoLayout from './components/IfoLayout'

const inactiveIfo: Ifo[] = ifosConfig.filter((ifo) => !ifo.isActive)

const PastIfo = () => {
  return (
    <IfoLayout id="past-ifos">
      {inactiveIfo.map((ifo) => {
        switch (ifo.version) {
          case 1:
            return <IfoCardV1Data key={ifo.id} ifo={ifo} />
          case 2:
            return <IfoCardV2Data key={ifo.id} ifo={ifo} />
          case 3:
            return <IfoCardV3Data key={ifo.id} ifo={ifo} />
          default:
            return null
        }
      })}
    </IfoLayout>
  )
}

export default PastIfo
