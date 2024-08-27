import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, AutoRow, Card, CardBody, Column, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import { formatDollarAmount } from 'views/V3Info/utils/numbers'
import { ChangePercent } from './ChangePercent'
import { PoolTokens } from './PoolTokens'

type PoolStatusProps = {
  poolInfo?: PoolInfo | null
}
export const PoolStatus: React.FC<PoolStatusProps> = ({ poolInfo }) => {
  const { t } = useTranslation()

  const tvlChange = useMemo(() => {
    if (!poolInfo) return null
    const tvlUsd = Number(poolInfo.tvlUsd ?? 0)
    const tvlUsd24h = Number(poolInfo.tvlUsd24h ?? 0)
    return new Percent(BigInt((tvlUsd - tvlUsd24h).toFixed(0)), BigInt((tvlUsd24h || 1).toFixed(0)))
  }, [poolInfo])

  const volChange = useMemo(() => {
    if (!poolInfo) return null
    const vol24hUsd = Number(poolInfo.vol24hUsd ?? 0)
    const vol48hUsd = Number(poolInfo.vol48hUsd ?? 0)
    return new Percent(BigInt((vol24hUsd - vol48hUsd).toFixed(0)), BigInt((vol48hUsd || 1).toFixed(0)))
  }, [poolInfo])

  if (!poolInfo) {
    return null
  }

  return (
    <Card>
      <CardBody>
        <AutoColumn gap="lg">
          <Column>
            <Text color="textSubtle" textTransform="uppercase">
              {t('total tokens locked (TVL)')}
            </Text>
            <AutoRow gap="sm">
              <Text as="h3" fontSize="24px" fontWeight={600}>
                {formatDollarAmount(Number(poolInfo.tvlUsd ?? 0))}
              </Text>
              {tvlChange ? <ChangePercent percent={tvlChange} /> : null}
            </AutoRow>
          </Column>
          <PoolTokens poolInfo={poolInfo} />
          <Column>
            <Text color="textSubtle" textTransform="uppercase">
              {t('volume 24h')}
            </Text>
            <AutoRow gap="sm">
              <Text as="h3" fontSize="24px" fontWeight={600}>
                {formatDollarAmount(Number(poolInfo.vol24hUsd ?? 0))}
              </Text>
              {volChange ? <ChangePercent percent={volChange} /> : null}
            </AutoRow>
          </Column>
          <Column>
            <Text color="textSubtle" textTransform="uppercase">
              {t('fee')}
            </Text>
            <Text as="h3" fontSize="24px" fontWeight={600}>
              {formatDollarAmount(Number(poolInfo.totalFeeUSD ?? 0))}
            </Text>
          </Column>
        </AutoColumn>
      </CardBody>
    </Card>
  )
}
