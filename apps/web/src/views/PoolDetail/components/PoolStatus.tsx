import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, AutoRow, Card, CardBody, Column, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import { getPercentChange } from 'utils/infoDataHelpers'
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
    return getPercentChange(tvlUsd, tvlUsd24h)
  }, [poolInfo])

  const volChange = useMemo(() => {
    if (!poolInfo) return null
    const volNow = poolInfo.vol24hUsd ? parseFloat(poolInfo.vol24hUsd) : 0
    const volBefore = poolInfo.vol48hUsd ? parseFloat(poolInfo.vol48hUsd) - volNow : 0
    return getPercentChange(volNow, volBefore)
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
              {t('fee 24h')}
            </Text>
            <Text as="h3" fontSize="24px" fontWeight={600}>
              {formatDollarAmount(Number(poolInfo.fee24hUsd ?? 0))}
            </Text>
          </Column>
        </AutoColumn>
      </CardBody>
    </Card>
  )
}
