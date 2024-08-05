import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, ErrorIcon, Flex, FlexGap, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'

interface ConfirmDeleteModalProps extends InjectedModalProps {
  handleDelete: () => void
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ handleDelete, onDismiss }) => {
  const { t } = useTranslation()

  const handleClickDelete = () => {
    handleDelete()
    onDismiss?.()
  }

  return (
    <Modal title={t('Remove the task')} headerBorderColor="transparent" onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '380px']}
      >
        <Box width="100%">
          <ErrorIcon display="block" m="auto" width={50} height={50} color="primary" />
          <Box mt="20px">
            <Text fontSize={14} mt="4px" textAlign="center" color="textSubtle">
              {t('Are you sure you want to remove the task?')}
            </Text>
          </Box>
          <FlexGap gap="8px" mt="40px">
            <Button variant="secondary" width="100%" onClick={onDismiss}>
              {t('Cancel')}
            </Button>
            <Button width="100%" onClick={handleClickDelete}>
              {t('Confirm')}
            </Button>
          </FlexGap>
        </Box>
      </Flex>
    </Modal>
  )
}
