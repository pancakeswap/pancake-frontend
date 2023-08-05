import { Button, Modal, ModalV2, ModalBody, ModalV2Props, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { useCallback } from 'react'
import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

import { useChainNames } from '../../../hooks/useChainNames'

type Props = {
  // iCAKE on source chain to bridge
  icake?: CurrencyAmount<Currency>

  sourceChainId?: ChainId
  ifoChainId?: ChainId
} & ModalV2Props

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 514px;
  }
`

const BodyText = styled(Text).attrs({
  fontSize: '0.875rem',
  color: 'textSubtle',
})``

export function BridgeICakeModal({ icake, sourceChainId, ifoChainId, ...rest }: Props) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { switchNetworkAsync } = useSwitchNetwork()
  const isCurrentChainSourceChain = chainId === sourceChainId
  const switchToSourceChain = useCallback(
    () => sourceChainId && !isCurrentChainSourceChain && switchNetworkAsync(sourceChainId),
    [sourceChainId, switchNetworkAsync, isCurrentChainSourceChain],
  )

  const onBridge = useCallback(async () => {
    try {
      await switchToSourceChain()
    } catch (e) {
      console.error(e)
    }
  }, [switchToSourceChain])

  return (
    <ModalV2 {...rest}>
      <StyledModal title={t('Bridge iCAKE')}>
        <ModalBody>
          <BodyText>
            {t(
              'To participate in the cross chain Public Sale, you need to bridge your iCAKE to the blockchain where the IFO will be hosted on.',
            )}
          </BodyText>
          <BodyText mt="1rem">
            {t(
              'Before or during the sale, you may bridge you iCAKE again if you’ve added more CAKE or extended your lock staking position.',
            )}
          </BodyText>
          <Button mt="1.5rem" width="100%" onClick={onBridge}>
            {isCurrentChainSourceChain ? t('Bridge iCAKE') : t('Switch Network to Bridge')}
          </Button>
        </ModalBody>
      </StyledModal>
    </ModalV2>
  )
}
