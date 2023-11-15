import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, Text } from '@pancakeswap/uikit'
import formatLocalisedCompactNumber from '@pancakeswap/utils/formatBalance'
import { useMemo } from 'react'
import { GaugeVoting } from '../hooks/useGaugesVoting'

export const ChartLabel: React.FC<{
  total?: number
  gauge?: GaugeVoting
}> = ({ total = 1, gauge }) => {
  const { t } = useTranslation()
  const percent = useMemo(() => {
    return new Percent(gauge?.weight ?? 0, total || 1).toFixed(2)
  }, [total, gauge])
  return (
    <AutoColumn alignItems="center" justifyContent="center" textAlign="center">
      <Text textTransform="uppercase" fontWeight={600} fontSize={12}>
        {t('total')}
      </Text>
      <Text bold fontSize={16}>
        {`${formatLocalisedCompactNumber(gauge?.weight || total, true)} veCAKE`}
      </Text>
      {gauge?.weight ? (
        <Text fontSize={14} color="textSubtle">
          {percent}% of total supply
        </Text>
      ) : null}
    </AutoColumn>
  )
}
