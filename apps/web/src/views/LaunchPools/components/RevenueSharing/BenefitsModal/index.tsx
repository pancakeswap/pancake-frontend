import { useTranslation } from '@pancakeswap/localization'
import { AtomBox, Flex, ModalBody, ModalCloseButton, ModalContainer, RowBetween, Text } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'

import { Token } from '@pancakeswap/sdk'
import { DeserializedLockedVaultUser } from 'state/types'
import RevenueSharing from 'views/Pools/components/RevenueSharing/BenefitsModal/RevenueSharing'
import SharingPoolNameCell from 'views/Pools/components/RevenueSharing/BenefitsModal/SharingPoolNameCell'
import { useAccount } from 'wagmi'

const Container = styled(ModalContainer)`
  width: 100%;
  overflow: hidden;
  max-height: 90vh;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 375px;
  }
`

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 100vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

interface BenefitsModalProps {
  pool: Pool.DeserializedPool<Token>
  userData?: DeserializedLockedVaultUser
  onDismiss?: () => void
}

const BenefitsModal: React.FunctionComponent<React.PropsWithChildren<BenefitsModalProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()

  useAccount({
    onConnect: ({ connector }) => {
      connector?.addListener('change', () => onDismiss?.())
    },
    onDisconnect: () => onDismiss?.(),
  })

  return (
    <Container>
      <AtomBox bg="gradientBubblegum" py="24px">
        <RowBetween flexWrap="nowrap" px="24px">
          <Text fontSize={20} bold>
            {t('Locked CAKE Benefits')}
          </Text>
          <ModalCloseButton onDismiss={onDismiss} />
        </RowBetween>
        <ModalBody mt="16px" width="100%" style={{ maxHeight: 'calc(100vh - 260px)' }}>
          <ScrollableContainer px="24px">
            <SharingPoolNameCell />
            <RevenueSharing onDismiss={onDismiss} />
          </ScrollableContainer>
        </ModalBody>
      </AtomBox>
    </Container>
  )
}

export default BenefitsModal
