import React from 'react'
import { ifosConfig } from 'sushi/lib/constants'
import { Ifo } from 'sushi/lib/constants/types'
import IfoCard from './components/IfoCard'
import IfoCards from './components/IfoCards'

const inactiveIfo: Ifo[] = ifosConfig.filter((ifo) => !ifo.isActive)

const PastIfo = () => {
  return (
    <IfoCards>
      {inactiveIfo.map((ifo) => (
        <IfoCard key={ifo.id} ifo={ifo} />
      ))}
    </IfoCards>
  )
}

export default PastIfo
