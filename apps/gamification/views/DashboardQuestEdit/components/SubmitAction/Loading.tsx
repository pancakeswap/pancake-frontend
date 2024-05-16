import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Spinner, Text } from '@pancakeswap/uikit'

interface LoadingProps {
  isPublish: boolean
}

export const Loading: React.FC<React.PropsWithChildren<LoadingProps>> = ({ isPublish, children }) => {
  const { t } = useTranslation()

  return (
    <Flex width="100%" flexDirection="column">
      <Box margin="auto auto 24px auto">
        <Spinner size={100} />
      </Box>
      {children}
      <Text textAlign="center" bold color="textSubtle" mt="20px">
        {isPublish ? t('Wait while the quest is being published...') : t('Wait while the quest is being scheduled...')}
      </Text>
    </Flex>
  )
}
