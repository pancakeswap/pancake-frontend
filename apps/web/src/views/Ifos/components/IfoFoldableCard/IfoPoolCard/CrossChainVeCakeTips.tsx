import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import { useIfoSourceChain } from 'views/Ifos/hooks/useIfoSourceChain'
import { useUserVeCakeStatus } from 'views/Ifos/hooks/useUserVeCakeStatus'
import { useChainNames } from '../../../hooks/useChainNames'
import { ContentText, LinkTitle, WarningTips } from '../../WarningTips'
import { StakeButton } from './StakeButton'
import { SyncVeCakeButton } from './SyncVeCakeButton'

type Props = {
  ifoChainId: ChainId
}

export function CrossChainVeCakeTips({ ifoChainId }: Props) {
  const { t } = useTranslation()
  const { account, chainId } = useAccountActiveChain()
  const sourceChain = useIfoSourceChain(ifoChainId)

  const { balance: veCakeOnBSC } = useVeCakeBalance(ChainId.BSC)
  const { balance: veCakeOnTargetChain } = useVeCakeBalance(ifoChainId)
  const { isSynced } = useUserVeCakeStatus(account, ifoChainId)

  const isCurrentChainSourceChain = useMemo(() => chainId === sourceChain, [chainId, sourceChain])

  const noVeCAKE = useMemo(() => veCakeOnBSC.isZero(), [veCakeOnBSC])
  const shouldSyncAgain = useMemo(
    () => !isSynced && !veCakeOnTargetChain.isEqualTo(veCakeOnBSC),
    [veCakeOnTargetChain, veCakeOnBSC, isSynced],
  )

  const chainName = useChainNames([ifoChainId])

  if (isSynced) {
    return null
  }

  const tips = noVeCAKE
    ? t('You don’t have any veCAKE available for IFO public sale.')
    : shouldSyncAgain
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
      title={!shouldSyncAgain && <LinkTitle href="/ifo#ifo-how-to">{t('How to Take Part')} »</LinkTitle>}
      content={<ContentText>{tips}</ContentText>}
    />
  )
}
