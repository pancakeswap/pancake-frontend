import { ifosConfig } from 'config/constants'
import styled from 'styled-components'
import React from 'react'
import { usePool } from 'state/pools/hooks'
import useGetPublicIfoV2Data from 'views/Ifos/hooks/v2/useGetPublicIfoData'
import useGetWalletIfoV2Data from 'views/Ifos/hooks/v2/useGetWalletIfoData'
import IfoStakePoolCard from 'views/Pools/components/IfoStakePoolCard'
import { VaultKey } from 'state/types'
import IfoLayout from './components/IfoLayout'
import IfoQuestions from './components/IfoQuestions'
import IfoSteps from './components/IfoSteps'
import { IfoCurrentCard } from './components/IfoFoldableCard'

const FlexRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 32px;
`

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const Ifo = () => {
  const publicIfoData = useGetPublicIfoV2Data(activeIfo)
  const walletIfoData = useGetWalletIfoV2Data(activeIfo)
  const { pool } = usePool(0)

  return (
    <IfoLayout id="current-ifo">
      <FlexRow>
        <IfoStakePoolCard defaultExpanded pool={{ ...pool, vaultKey: VaultKey.IfoPool }} showStakedOnly={false} />
        <IfoCurrentCard ifo={activeIfo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
      </FlexRow>
      <IfoSteps ifo={activeIfo} walletIfoData={walletIfoData} />
      <IfoQuestions />
    </IfoLayout>
  )
}

export default Ifo
