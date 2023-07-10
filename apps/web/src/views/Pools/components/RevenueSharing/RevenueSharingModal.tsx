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
    <ModalContainer style={{ width: '300px', maxHeight: '90vh', overflow: 'hidden' }}>
      <AtomBox bg="gradientBubblegum" py="24px" maxWidth="420px">
        <RowBetween flexWrap="nowrap" px="24px">
          <Text fontSize={20} bold>
            {t('Locked CAKE Benefits')}
          </Text>
          <ModalCloseButton onDismiss={onDismiss} />
        </RowBetween>
        <ModalBody mt="16px">
          <ScrollableContainer px="24px">123</ScrollableContainer>
        </ModalBody>
        <AutoColumn px="24px" gap="16px">
          <ModalActions>
            <Button width="100%" variant="primary">
              {t('Harvest All')}
            </Button>
          </ModalActions>
        </AutoColumn>
      </AtomBox>
    </ModalContainer>
  )
}

export default RevenueSharingModal
