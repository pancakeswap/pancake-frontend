import { Flex, Text, BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const ComingSoon = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column" mt="24px">
      <BunnyPlaceholderIcon width={80} height={80} />
      <Text color="textDisabled" fontSize="20px" mt="8px" textAlign="center" bold>
        {t('Coming Soon')}
      </Text>
    </Flex>
  )
}

export default ComingSoon
