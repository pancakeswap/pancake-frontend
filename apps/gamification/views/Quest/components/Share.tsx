import { useTranslation } from '@pancakeswap/localization'
import { Flex, MoreIcon, Text } from '@pancakeswap/uikit'

export const Share = () => {
  const { t } = useTranslation()

  return (
    <Flex position="relative" ml="auto">
      <Text color="primary" bold style={{ cursor: 'pointer' }}>
        {t('Share')}
      </Text>
      <MoreIcon ml="6px" color="primary" style={{ cursor: 'pointer' }} />
    </Flex>
  )
}
