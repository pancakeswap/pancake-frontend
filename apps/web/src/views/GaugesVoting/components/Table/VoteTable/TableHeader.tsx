import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'
import { THeader } from '../styled'

export const TableHeader: React.FC<{
  count?: number
}> = ({ count = 0 }) => {
  const { t } = useTranslation()
  return (
    <THeader style={{ borderTop: 'none' }}>
      <Text color="secondary" textTransform="uppercase" fontWeight={600}>
        {t('gauges')}({count})
      </Text>
      <Text color="secondary" textTransform="uppercase" fontWeight={600}>
        {t('current votes')}
      </Text>

      <Text color="secondary" textTransform="uppercase" fontWeight={600}>
        {t('preview votes')}
      </Text>

      <Text color="secondary" textTransform="uppercase" fontWeight={600} textAlign="right">
        {t('My veCake %')}
      </Text>
    </THeader>
  )
}
