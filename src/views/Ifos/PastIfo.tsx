import React from 'react'
import { ifosConfig } from 'config/constants'
import { Ifo } from 'config/constants/types'
import IfoCard from './components/IfoCard'
import IfoCardsLayout from './components/IfoCardsLayout'

const inactiveIfo: Ifo[] = ifosConfig.filter((ifo) => !ifo.isActive)

const PastIfo = () => {
  return (
    <IfoCardsLayout>
      {/* {inactiveIfo.map((ifo) => (
        <IfoCard key={ifo.id} ifo={ifo} cardType="unlimited" />
      ))} */}
    </IfoCardsLayout>
  )
}

export default PastIfo
