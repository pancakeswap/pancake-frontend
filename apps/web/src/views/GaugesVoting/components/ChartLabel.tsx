import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Text } from '@pancakeswap/uikit'

export const ChartLabel = () => {
  const { t } = useTranslation()
  return (
    <AutoColumn alignItems="center" justifyContent="center" textAlign="center">
      <Text textTransform="uppercase" fontWeight={600} fontSize={12}>
        {t('total')}
      </Text>
      <Text bold fontSize={16}>
        50.8M veCAKE
      </Text>
      <Text fontSize={14} color="textSubtle">
        96.52% of total supply
      </Text>
    </AutoColumn>
  )
}
