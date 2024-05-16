import { useTranslation } from '@pancakeswap/localization'
import { Button, CheckmarkCircleIcon, Flex, Text } from '@pancakeswap/uikit'

interface FinishedProps {
  isPublish: boolean
  closeModal: () => void
}

export const Finished: React.FC<React.PropsWithChildren<FinishedProps>> = ({ isPublish, closeModal, children }) => {
  const { t } = useTranslation()

  return (
    <Flex width="100%" flexDirection="column">
      <CheckmarkCircleIcon width={64} height={64} color="primary" margin="auto auto 24px auto" />
      {children}
      <Text textAlign="center" bold color="textSubtle" mt="20px">
        {isPublish ? t('The quest has been successfully published!') : t('The quest has been successfully scheduled!')}
      </Text>
      <Button mt="24px" width="100%" onClick={closeModal}>
        {t('Nice!')}
      </Button>
    </Flex>
  )
}
