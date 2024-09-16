import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'

import { useUserVeCakeStatus } from 'components/CrossChainVeCakeModal/hooks/useUserVeCakeStatus'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import { useIfoSourceChain } from 'views/Ifos/hooks/useIfoSourceChain'
import { useChainNames } from '../../../hooks/useChainNames'
import { ContentText, LinkTitle, WarningTips } from '../../WarningTips'
import { StakeButton } from './StakeButton'
import { SyncVeCakeButton } from './SyncVeCakeButton'

type Props = {
  ifoChainId: ChainId
}

export function CrossChainVeCakeTips({ ifoChainId }: Props) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const sourceChain = useIfoSourceChain(ifoChainId)

  const { balance: veCakeOnBSC } = useVeCakeBalance(ChainId.BSC)

  const { isSynced } = useUserVeCakeStatus(ifoChainId)

  const isCurrentChainSourceChain = useMemo(() => chainId === sourceChain, [chainId, sourceChain])

  const noVeCAKE = useMemo(() => veCakeOnBSC.isZero(), [veCakeOnBSC])

  const chainName = useChainNames([ifoChainId])

  if (isSynced) {
    return null
  }

  const tips = noVeCAKE
    ? t('You don’t have any veCAKE available for IFO public sale.')
    : !isSynced
    ? isCurrentChainSourceChain
      ? t('You must sync your veCAKE again (for an updated iCAKE) if you have updated your veCAKE staking.')
      : t(
          'Switch chain to BNB and sync your veCAKE again (for an updated iCAKE) if you have updated your veCAKE staking.',
        )
    : t('Sync your veCAKE to participate in this sale on %chain%', {
        chain: chainName,
      })

  const action = noVeCAKE ? <StakeButton /> : <SyncVeCakeButton ifoChainId={ifoChainId} buttonVisible />

  return (
    <WarningTips
      mt="1.5rem"
      action={action}
      title={<LinkTitle href="/ifo#ifo-how-to">{t('How to Take Part')} »</LinkTitle>}
      content={<ContentText>{tips}</ContentText>}
    />
  )
}
