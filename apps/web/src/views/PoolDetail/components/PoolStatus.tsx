import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, AutoRow, Card, CardBody, Column, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useChainNameByQuery } from 'state/info/hooks'
import { formatDollarAmount } from 'views/V3Info/utils/numbers'
import { ChangePercent } from './ChangePercent'
import { PoolTokens } from './PoolTokens'

type PoolStatusProps = {
  poolInfo?: PoolInfo | null
}
export const PoolStatus: React.FC<PoolStatusProps> = ({ poolInfo }) => {
  const { t } = useTranslation()
  const chainName = useChainNameByQuery()
  const tvlChange = useMemo(() => {
    if (!poolInfo) return null
    return new Percent(
      BigInt((Number(poolInfo.tvlUsd ?? 0) - Number(poolInfo.tvlUsd24h ?? 0)).toFixed(0)),
      BigInt(Number(poolInfo.tvlUsd ?? 1).toFixed(0)),
    )
  }, [poolInfo])
  const volChange = useMemo(() => {
    if (!poolInfo) return null
    return new Percent(
      BigInt((Number(poolInfo.vol24hUsd ?? 0) - Number(poolInfo.vol48hUsd ?? 0)).toFixed(0)),
      BigInt(Number(poolInfo.vol24hUsd ?? 1).toFixed(0)) || BigInt(1),
    )
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
