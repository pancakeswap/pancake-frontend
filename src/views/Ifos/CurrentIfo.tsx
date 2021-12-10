import { ifosConfig } from 'config/constants'
import React from 'react'
import { DeserializedPool } from 'state/types'
import useGetPublicIfoV2Data from 'views/Ifos/hooks/v2/useGetPublicIfoData'
import useGetWalletIfoV2Data from 'views/Ifos/hooks/v2/useGetWalletIfoData'
import CakeVaultCard from 'views/Pools/components/CakeVaultCard'
import { IfoCurrentCard } from './components/IfoFoldableCard'
import IfoLayout, { IfoLayoutWrapper } from './components/IfoLayout'
import IfoQuestions from './components/IfoQuestions'
import IfoSteps from './components/IfoSteps'

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const Ifo = ({ pool }: { pool: DeserializedPool }) => {
  const publicIfoData = useGetPublicIfoV2Data(activeIfo)
  const walletIfoData = useGetWalletIfoV2Data(activeIfo)

  return (
    <IfoLayout id="current-ifo">
      <IfoLayoutWrapper>
        <CakeVaultCard m="auto" defaultFooterExpanded pool={pool} showStakedOnly={false} />
        <IfoCurrentCard ifo={activeIfo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
      </IfoLayoutWrapper>
      <IfoSteps ifo={activeIfo} walletIfoData={walletIfoData} />
      <IfoQuestions />
    </IfoLayout>
  )
}

export default Ifo
