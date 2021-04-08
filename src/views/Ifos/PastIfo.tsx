import React from 'react'
import { ifosConfig } from 'config/constants'
import { Ifo } from 'config/constants/types'
import IfoCard from './components/IfoV1Card'
import IfoCardLayout from './components/IfoCardLayout'

const inactiveIfo: Ifo[] = ifosConfig.filter((ifo) => !ifo.isActive)

const PastIfo = () => {
  return (
    <IfoCardLayout>
      {inactiveIfo.map((ifo) => (
        <IfoCard key={ifo.id} ifo={ifo} />
      ))}
    </IfoCardLayout>
  )
}

export default PastIfo
