import { Button, Modal, ModalV2, ModalBody, ModalV2Props, Text, Flex, useTooltip, Box } from '@pancakeswap/uikit'
import Image from 'next/image'
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
  const { targetRef, tooltip } = useTooltip(<Box style={{ maxWidth: '160px' }}>{tips}</Box>, {
    placement: 'left',
    manualVisible: true,
    tooltipOffset: [0, -22],
    isInPortal: false,
  })

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
          <Flex flexDirection="row" justifyContent="flex-end" mt="2.5rem">
            <Image
              ref={targetRef}
              alt="instructor-bunny"
              style={{ maxHeight: '115px' }}
              src="/images/ifos/assets/bunny-instructor.png"
              width={117}
              height={115}
            />
            {tips && tooltip}
          </Flex>
          <Button mt="3rem" width="100%" onClick={onSwitch}>
            {buttonText}
          </Button>
        </ModalBody>
      </StyledModal>
    </ModalV2>
  )
}
