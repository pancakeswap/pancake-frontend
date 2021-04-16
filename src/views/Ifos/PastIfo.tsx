import React from 'react'
import { ifosConfig } from 'config/constants'
import { Ifo } from 'config/constants/types'
import IfoV1Card from './components/IfoV1Card'
import IfoV2Card from './components/IfoV2Card'
import IfoCardLayout from './components/IfoCardLayout'

const inactiveIfo: Ifo[] = ifosConfig.filter((ifo) => !ifo.isActive)

const PastIfo = () => {
  return (
    <IfoCardLayout>
      {inactiveIfo.map((ifo) =>
        ifo.isV1 ? (
          <IfoV1Card key={ifo.id} ifo={ifo} />
        ) : (
          <IfoV2Card key={ifo.id} ifo={ifo} isInitiallyVisible={false} />
        ),
      )}
    </IfoCardLayout>
  )
}

export default PastIfo
