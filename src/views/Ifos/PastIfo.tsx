import { Flex } from '@pancakeswap/uikit'
import { ifosConfig } from 'config/constants'
import { Ifo } from 'config/constants/types'
import React from 'react'
import { DeserializedPool } from 'state/types'
import CakeVaultCard from 'views/Pools/components/CakeVaultCard'
import IfoCardV1Data from './components/IfoCardV1Data'
import IfoCardV2Data from './components/IfoCardV2Data'
import IfoCardV3Data from './components/IfoCardV3Data'
import IfoLayout, { IfoLayoutWrapper } from './components/IfoLayout'

const inactiveIfo: Ifo[] = ifosConfig.filter((ifo) => !ifo.isActive)

const PastIfo = ({ pool }: { pool: DeserializedPool }) => {
  return (
    <IfoLayoutWrapper>
      <Flex width="100%" pt="40px" justifyContent="center">
        <CakeVaultCard defaultFooterExpanded pool={pool} showStakedOnly={false} />
      </Flex>
      <IfoLayout width="100%" id="past-ifos">
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
    </IfoLayoutWrapper>
  )
}

export default PastIfo
