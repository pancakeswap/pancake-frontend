import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

import { useChainNames } from '../../../hooks/useChainNames'
import { useICakeBridgeStatus } from '../../../hooks/useIfoCredit'
import { ContentText, LinkTitle, WarningTips } from '../../WarningTips'
import { BridgeButton } from './BridgeButton'
import { StakeButton } from './StakeButton'

type Props = {
  ifoId: string

  ifoChainId: ChainId

  ifoAddress?: Address
}

export function CrossChainVeCakeTips({ ifoChainId, ifoId, ifoAddress }: Props) {
  const { t } = useTranslation()
  const { noICake, hasBridged, shouldBridgeAgain, sourceChainCredit, destChainCredit } = useICakeBridgeStatus({
    ifoChainId,
    ifoAddress,
  })
  const chainName = useChainNames([ifoChainId])

  if (hasBridged) {
    return (
      <BridgeButton
        mt="0.625rem"
        ifoChainId={ifoChainId}
        icake={sourceChainCredit}
        dstIcake={destChainCredit}
        buttonVisible={false}
        ifoId={ifoId}
      />
    )
  }

  const tips = noICake
    ? t('You don’t have any iCAKE available for IFO public sale.')
    : shouldBridgeAgain
    ? t('Bridge iCAKE again if you have extended your CAKE staking or added more CAKE')
    : t('Bridge your iCAKE to participate this sale on %chain%', {
        chain: chainName,
      })

  const action = noICake ? (
    <StakeButton />
  ) : (
    <BridgeButton ifoChainId={ifoChainId} icake={sourceChainCredit} dstIcake={destChainCredit} ifoId={ifoId} />
  )

  return (
    <WarningTips
      mt="1.5rem"
      action={action}
      title={!shouldBridgeAgain && <LinkTitle href="/ifo#ifo-how-to">{t('How to Take Part')} »</LinkTitle>}
      content={<ContentText>{tips}</ContentText>}
    />
  )
}
