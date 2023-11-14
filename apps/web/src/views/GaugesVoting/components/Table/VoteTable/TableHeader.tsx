import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'
import { THeader } from '../styled'

export const TableHeader = () => {
  const { t } = useTranslation()
  return (
    <THeader>
      <Text color="secondary" textTransform="uppercase" fontWeight={600}>
        {t('gauges')}(7)
      </Text>
      <Text color="secondary" textTransform="uppercase" fontWeight={600}>
        {t('current votes')}
      </Text>

      <Text color="secondary" textTransform="uppercase" fontWeight={600}>
        {t('previous votes')}
      </Text>

      <Text color="secondary" textTransform="uppercase" fontWeight={600} textAlign="right">
        {t('My veCake %')}
      </Text>
    </THeader>
  )
}
