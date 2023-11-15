import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, Text } from '@pancakeswap/uikit'
import formatLocalisedCompactNumber from '@pancakeswap/utils/formatBalance'
import { useMemo } from 'react'

export const ChartLabel: React.FC<{
  total?: number
  value?: number
}> = ({ total = 1, value = 0 }) => {
  const { t } = useTranslation()
  const percent = useMemo(() => {
    return new Percent(value, total).toFixed(2)
  }, [total, value])
  return (
    <AutoColumn alignItems="center" justifyContent="center" textAlign="center">
      <Text textTransform="uppercase" fontWeight={600} fontSize={12}>
        {t('total')}
      </Text>
      <Text bold fontSize={16}>
        {`${formatLocalisedCompactNumber(value || total, true)} veCAKE`}
      </Text>
      {value ? (
        <Text fontSize={14} color="textSubtle">
          {percent}% of total supply
        </Text>
      ) : null}
    </AutoColumn>
  )
}
