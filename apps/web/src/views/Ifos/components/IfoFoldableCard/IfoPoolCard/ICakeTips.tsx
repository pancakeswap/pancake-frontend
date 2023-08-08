import { Box, Message, MessageText, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'

import { MessageTextLink } from '../../IfoCardStyles'
import { StakeButton } from './StakeButton'
import { useIfoCredit } from '../../../hooks/useIfoCredit'
import { useChainNames } from '../../../hooks/useChainNames'
import { useIfoSourceChain } from '../../../hooks/useIfoSourceChain'
import { BridgeButton } from './BridgeButton'

type Props = {
  ifoChainId: ChainId
  // Ifo credit on destination chain, i.e. the chain on which ifo is hosted
  ifoCredit?: BigNumber
}

export function ICakeTips({ ifoChainId, ifoCredit }: Props) {
  const { t } = useTranslation()
  const sourceChain = useIfoSourceChain()
  const destChainCredit = useIfoCredit({ chainId: ifoChainId, ifoCredit })
  const sourceChainCredit = useIfoCredit({ chainId: sourceChain, ifoCredit })
  const chainName = useChainNames([ifoChainId])
  const noICake = useMemo(() => !sourceChainCredit || sourceChainCredit.quotient === 0n, [sourceChainCredit])
  const isICakeSynced = useMemo(
    () => destChainCredit && sourceChainCredit && destChainCredit.quotient === sourceChainCredit.quotient,
    [sourceChainCredit, destChainCredit],
  )
  const shouldBridgeAgain = useMemo(
    () =>
      ifoCredit && sourceChainCredit && ifoCredit.gt(0) && sourceChainCredit.quotient !== BigInt(ifoCredit.toString()),
    [ifoCredit, sourceChainCredit],
  )

  if (!noICake && isICakeSynced) {
    return <BridgeButton mt="0.625rem" ifoChainId={ifoChainId} icake={sourceChainCredit} buttonVisible={false} />
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
    <BridgeButton mt="0.625rem" ifoChainId={ifoChainId} icake={sourceChainCredit} />
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
