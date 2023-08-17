import { Box, Message, MessageText, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'

import { MessageTextLink } from '../../IfoCardStyles'
import { StakeButton } from './StakeButton'
import { useICakeBridgeStatus } from '../../../hooks/useIfoCredit'
import { useChainNames } from '../../../hooks/useChainNames'
import { BridgeButton } from './BridgeButton'

type Props = {
  ifoId: string

  ifoChainId: ChainId
  // Ifo credit on destination chain, i.e. the chain on which ifo is hosted
  ifoCredit?: BigNumber
}

export function ICakeTips({ ifoChainId, ifoCredit, ifoId }: Props) {
  const { t } = useTranslation()
  const { noICake, hasBridged, shouldBridgeAgain, sourceChainCredit, destChainCredit } = useICakeBridgeStatus({
    ifoChainId,
    ifoCredit,
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
    <StakeButton mt="0.625rem" />
  ) : (
    <BridgeButton
      mt="0.625rem"
      ifoChainId={ifoChainId}
      icake={sourceChainCredit}
      dstIcake={destChainCredit}
      ifoId={ifoId}
    />
  )

  return (
    <Message my="24px" p="8px" variant="warning" action={action}>
      <Flex flexDirection="column">
        <Box>
          <MessageText display="inline">{tips}</MessageText>{' '}
          <MessageTextLink display="inline" fontWeight={700} href="/ifo#ifo-how-to" color="warning">
            {t('How does it work?')} »
          </MessageTextLink>
        </Box>
      </Flex>
    </Message>
  )
}
