import { ifosConfig } from 'config/constants'
import styled from 'styled-components'
import React from 'react'
import { useIfoPool, usePool } from 'state/pools/hooks'
import useGetPublicIfoV2Data from 'views/Ifos/hooks/v2/useGetPublicIfoData'
import useGetWalletIfoV2Data from 'views/Ifos/hooks/v2/useGetWalletIfoData'
import CakeVaultCard from 'views/Pools/components/CakeVaultCard'
import { VaultKey } from 'state/types'
import { getAprData } from 'views/Pools/helpers'
import IfoLayout from './components/IfoLayout'
import IfoQuestions from './components/IfoQuestions'
import IfoSteps from './components/IfoSteps'
import { IfoCurrentCard } from './components/IfoFoldableCard'

const FlexRow = styled.div`
  gap: 32px;
  display: grid;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: minmax(300px, 1fr) minmax(462px, 2fr);
  }

  > div {
    margin: 0 auto;
  }
`

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const Ifo = () => {
  const publicIfoData = useGetPublicIfoV2Data(activeIfo)
  const walletIfoData = useGetWalletIfoV2Data(activeIfo)
  const { pool } = usePool(0)

  const {
    fees: { performanceFeeAsDecimal },
  } = useIfoPool()

  const ifoPoolWithApr = { ...pool, vaultKey: VaultKey.IfoPool, apr: getAprData(pool, performanceFeeAsDecimal).apr }

  return (
    <IfoLayout id="current-ifo">
      <FlexRow>
        <CakeVaultCard m="auto" defaultFooterExpanded pool={ifoPoolWithApr} showStakedOnly={false} />
        <IfoCurrentCard ifo={activeIfo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
      </FlexRow>
      <IfoSteps ifo={activeIfo} walletIfoData={walletIfoData} />
      <IfoQuestions />
    </IfoLayout>
  )
}

export default Ifo
