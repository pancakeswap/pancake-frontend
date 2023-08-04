import { Box, Message, MessageText, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'

import { MessageTextLink } from '../../IfoCardStyles'
import { StakeButton } from './StakeButton'
import { useIfoCreditOnSourceChain } from '../../../hooks/useIfoCreditOnSourceChain'
import { useChainNames } from '../../../hooks/useChainNames'
import { BridgeButton } from './BridgeButton'

type Props = {
  ifoChainId: ChainId
  // Ifo credit on destination chain, i.e. the chain on which ifo is hosted
  ifoCredit?: BigNumber
}

export function ICakeTips({ ifoChainId, ifoCredit }: Props) {
  const { t } = useTranslation()
  const chainName = useChainNames([ifoChainId])
  const sourceChainCredit = useIfoCreditOnSourceChain({ ifoChainId })
  const noICake = useMemo(() => sourceChainCredit.quotient === 0n, [sourceChainCredit])
  const isICakeSynced = useMemo(
    () => ifoCredit && ifoCredit.eq(sourceChainCredit.quotient.toString()),
    [sourceChainCredit, ifoCredit],
  )
  // const shouldBridgeAgain = useMemo(
  //   () => ifoCredit && ifoCredit.gt(0) && sourceChainCredit.quotient !== BigInt(ifoCredit.toString()),
  //   [ifoCredit, sourceChainCredit],
  // )

  if (!noICake && isICakeSynced) {
    return null
  }

  const tips = noICake
    ? t('You don’t have any iCAKE available for IFO public sale.')
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
