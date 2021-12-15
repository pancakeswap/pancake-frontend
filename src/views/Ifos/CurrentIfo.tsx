import { ifosConfig } from 'config/constants'
import React from 'react'
import useGetPublicIfoV2Data from 'views/Ifos/hooks/v2/useGetPublicIfoData'
import useGetWalletIfoV3Data from 'views/Ifos/hooks/v3/useGetWalletIfoData'
import { IfoCurrentCard } from './components/IfoFoldableCard'
import IfoLayout, { IfoLayoutWrapper } from './components/IfoLayout'
import IfoPoolVaultCard from './components/IfoPoolVaultCard'
import IfoQuestions from './components/IfoQuestions'
import IfoSteps from './components/IfoSteps'

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const Ifo = () => {
  const publicIfoData = useGetPublicIfoV2Data(activeIfo)
  const walletIfoData = useGetWalletIfoV3Data(activeIfo)

  return (
    <IfoLayout id="current-ifo" py={['24px', '24px', '40px']}>
      <IfoLayoutWrapper>
        <IfoPoolVaultCard />
        <IfoCurrentCard ifo={activeIfo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
      </IfoLayoutWrapper>
      <IfoSteps isLive={publicIfoData.status === 'live'} ifo={activeIfo} walletIfoData={walletIfoData} />
      <IfoQuestions />
    </IfoLayout>
  )
}

export default Ifo
