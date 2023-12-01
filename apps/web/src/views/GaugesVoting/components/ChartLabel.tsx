import { Gauge } from '@pancakeswap/gauges'
import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, Text } from '@pancakeswap/uikit'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useMemo } from 'react'

export const ChartLabel: React.FC<{
  total?: number
  gauge?: Gauge
}> = ({ total = 1, gauge }) => {
  const { t } = useTranslation()
  const percent = useMemo(() => {
    return new Percent(gauge?.weight ?? 0, total || 1).toFixed(2)
  }, [total, gauge])
  const weight = useMemo(() => {
    return getBalanceNumber(new BN(String(gauge?.weight || total)))
  }, [gauge?.weight, total])

  return (
    <AutoColumn alignItems="center" justifyContent="center" textAlign="center">
      <Text textTransform="uppercase" fontWeight={600} fontSize={12}>
        {t('total')}
      </Text>
      <Text bold fontSize={16}>
        {`${formatLocalisedCompactNumber(weight, true)} veCAKE`}
      </Text>
      {gauge?.weight ? (
        <Text fontSize={14} color="textSubtle">
          {percent}% of total supply
        </Text>
      ) : null}
    </AutoColumn>
  )
}
