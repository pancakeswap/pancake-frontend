import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'

export const EmptyTable = () => {
  const { t } = useTranslation()
  return (
    <Text padding="24px" fontSize="16px" textAlign="center">
      {t('You are not currently voting any gauges.')}
    </Text>
  )
}
