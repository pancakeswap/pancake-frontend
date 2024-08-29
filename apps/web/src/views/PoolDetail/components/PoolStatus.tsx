import { useTranslation } from '@pancakeswap/localization'
import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { AutoColumn, AutoRow, Card, CardBody, Column, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import { getLpFeesAndApr } from 'utils/getLpFeesAndApr'
import { getPercentChange } from 'utils/infoDataHelpers'
import { Address, isAddressEqual } from 'viem'
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
  const fee24hUsd = useMemo(() => {
    if (!poolInfo) return 0
    if (poolInfo.fee24hUsd) {
      return parseFloat(poolInfo.fee24hUsd)
    }
    if (poolInfo.protocol === 'v2') {
      const { lpFees24h } = getLpFeesAndApr(
        parseFloat(poolInfo.vol24hUsd ?? '0'),
        parseFloat(poolInfo.vol7dUsd ?? '0'),
        parseFloat(poolInfo.tvlUsd ?? '0'),
      )
      return lpFees24h
    }

    const stablePair = LegacyRouter.stableSwapPairsByChainId[poolInfo.chainId].find((pair) => {
      return isAddressEqual(pair.stableSwapAddress, poolInfo?.stableSwapAddress as Address)
    })

    if (!stablePair) return 0

    return new BigNumber(stablePair.stableTotalFee).times(poolInfo.vol24hUsd ?? 0).toNumber()
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
              {formatDollarAmount(Number(fee24hUsd ?? 0))}
            </Text>
          </Column>
        </AutoColumn>
      </CardBody>
    </Card>
  )
}
