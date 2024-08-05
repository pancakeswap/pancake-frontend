import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, InjectedModalProps, Modal, Text, WarningIcon } from '@pancakeswap/uikit'

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
    <Modal title="" headerBorderColor="transparent" onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '380px']}
      >
        <Box width="100%" mt="-30px">
          <WarningIcon display="block" m="auto" width={50} height={50} color="failure" />
          <Box mt="20px">
            <Text textAlign="center" bold fontSize={20}>
              {t('Confirm Delete?')}
            </Text>
            <Text fontSize={14} mt="4px" textAlign="center" color="textSubtle">
              {t('Are you sure you want to delete?')}
            </Text>
          </Box>
          <Button width="100%" mt="40px" onClick={handleClickDelete}>
            {t('Confirm')}
          </Button>
        </Box>
      </Flex>
    </Modal>
  )
}
