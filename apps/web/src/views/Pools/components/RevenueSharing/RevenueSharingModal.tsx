import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import {
  ModalContainer,
  ModalCloseButton,
  Text,
  RowBetween,
  ModalBody,
  Flex,
  ModalActions,
  Button,
  AutoColumn,
} from '@pancakeswap/uikit'
import SharingPoolNameCell from './SharingPoolNameCell'
import RevenueSharing from './RevenueSharing'

const Container = styled(ModalContainer)`
  width: 100%;
  max-height: '90vh';
  overflow: 'hidden';

  ${({ theme }) => theme.mediaQueries.md} {
    width: 375px;
  }
`

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  max-height: 60vh;
`

interface RevenueSharingModalProps {
  onDismiss?: () => void
}

const RevenueSharingModal: React.FunctionComponent<React.PropsWithChildren<RevenueSharingModalProps>> = ({
  onDismiss,
}) => {
  const { t } = useTranslation()

  return (
    <Container>
      <AtomBox bg="gradientBubblegum" py="24px">
        <RowBetween flexWrap="nowrap" px="24px">
          <Text fontSize={20} bold>
            {t('Locked CAKE Benefits')}
          </Text>
          <ModalCloseButton onDismiss={onDismiss} />
        </RowBetween>
        <ModalBody mt="16px">
          <ScrollableContainer px="24px">
            <SharingPoolNameCell />
            <RevenueSharing />
          </ScrollableContainer>
        </ModalBody>
        <AutoColumn px="24px" gap="16px">
          <ModalActions>
            <Button width="100%" variant="primary">
              {t('Harvest All')}
            </Button>
          </ModalActions>
        </AutoColumn>
      </AtomBox>
    </Container>
  )
}

export default RevenueSharingModal
