import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, CloseCircleIcon, CrossIcon, Flex, RefreshIcon, Text } from '@pancakeswap/uikit'

interface FailProps {
  closeModal: () => void
  handleSubmit: () => void
}

export const Fail: React.FC<React.PropsWithChildren<FailProps>> = ({ closeModal, handleSubmit, children }) => {
  const { t } = useTranslation()

  return (
    <Flex width="100%" flexDirection="column">
      <CloseCircleIcon width={50} height={50} margin="auto auto 24px auto" color="failure" />
      {children}
      <Box mb="24px">
        <Text as="span" color="textSubtle">
          {t('Something went wrong, please try again. If the problem persists, please')}
        </Text>
        <Text as="span" color="primary" ml="4px">
          {t('contact our support team.')}
        </Text>
      </Box>
      <Flex>
        <Button
          width="100%"
          variant="secondary"
          endIcon={<CrossIcon width={20} height={20} color="primary" />}
          onClick={closeModal}
        >
          {t('Cancel')}
        </Button>
        <Button
          width="100%"
          ml="16px"
          endIcon={<RefreshIcon style={{ transform: 'scaleX(-1) rotate(0deg)' }} color="invertedContrast" />}
          onClick={handleSubmit}
        >
          {t('Retry')}
        </Button>
      </Flex>
    </Flex>
  )
}
