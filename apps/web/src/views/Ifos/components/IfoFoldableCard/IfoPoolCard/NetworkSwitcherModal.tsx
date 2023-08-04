import { Button, Modal, ModalV2, ModalBody, ModalV2Props, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { ReactNode, useCallback } from 'react'
import { ChainId } from '@pancakeswap/sdk'

import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

import { useChainNames } from '../../../hooks/useChainNames'

type Props = {
  supportedChains?: readonly ChainId[]
  title?: ReactNode
  description?: ReactNode
  tips?: ReactNode
  buttonText?: ReactNode
  onSwitchNetworkSuccess?: () => void
} & ModalV2Props

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 336px;
  }
`
const BodyTitle = styled(Text).attrs({
  bold: true,
})``

const BodyText = styled(Text).attrs({
  fontSize: '0.875rem',
})``

export function NetworkSwitcherModal({
  title,
  buttonText,
  description,
  tips,
  supportedChains,
  onSwitchNetworkSuccess,
  ...rest
}: Props) {
  const { t } = useTranslation()
  const chainNames = useChainNames(supportedChains)
  const { switchNetworkAsync } = useSwitchNetwork()
  const onSwitch = useCallback(async () => {
    if (!supportedChains?.length) {
      return
    }
    try {
      const result = await switchNetworkAsync(supportedChains[0])
      if (result) {
        onSwitchNetworkSuccess?.()
      }
    } catch (e) {
      console.error(e)
    }
  }, [switchNetworkAsync, supportedChains, onSwitchNetworkSuccess])

  return (
    <ModalV2 {...rest}>
      <StyledModal title={title}>
        <ModalBody>
          <BodyTitle>
            {t("It's a %chain% only feature", {
              chain: chainNames,
            })}
          </BodyTitle>
          <BodyText mt="1rem">{description}</BodyText>
          {tips}
          <Button mt="1.5rem" width="100%" onClick={onSwitch}>
            {buttonText}
          </Button>
        </ModalBody>
      </StyledModal>
    </ModalV2>
  )
}
