import { Box, Message, MessageText, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { useCallback, MouseEvent } from 'react'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

import { useChainNames } from '../../../hooks/useChainNames'
import { MessageTextLink } from '../../IfoCardStyles'

type Props = {
  ifoChainId: ChainId
}

export function SwitchNetworkTips({ ifoChainId }: Props) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const chainName = useChainNames([ifoChainId])
  const { switchNetworkAsync } = useSwitchNetwork()

  const onSwitchNetwork = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      if (chainId === ifoChainId) {
        return
      }
      switchNetworkAsync(ifoChainId)
    },
    [chainId, ifoChainId, switchNetworkAsync],
  )

  if (chainId === ifoChainId) {
    return null
  }

  return (
    <Message my="24px" p="8px" variant="primary">
      <Flex flexDirection="column">
        <Box>
          <MessageText display="inline">
            {t('This IFO is hosted on %chain%.', {
              chain: chainName,
            })}
          </MessageText>{' '}
          <MessageTextLink display="inline" fontWeight={700} onClick={onSwitchNetwork}>
            {t('Switch network')}
          </MessageTextLink>{' '}
          <MessageText display="inline">{t('to participate')}</MessageText>
        </Box>
      </Flex>
    </Message>
  )
}
