import { useTranslation } from '@pancakeswap/localization'
import { Column, Skeleton, Text } from '@pancakeswap/uikit'
import React, { useMemo } from 'react'
import { usePoolApr, usePoolInfo } from 'state/farmsV4/hooks'
import { PoolInfo } from 'state/farmsV4/state/type'
import { PoolGlobalAprButton, V3PoolDerivedAprButton } from 'views/universalFarms/components'

interface AprCalculatorV2Props {
  poolAddress: string | null
  chainId: number
  tokenId?: bigint
  showTitle?: boolean
}

const WithTitle = ({ children, pool }: { children: React.ReactNode; pool: PoolInfo }) => {
  const { t } = useTranslation()
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { cakeApr } = usePoolApr(key, pool)
  const hasFarmApr = cakeApr?.value !== '0'
  return (
    <Column gap="8px" alignItems="flex-end">
      <Text color="textSubtle" fontSize="12px">
        {hasFarmApr ? t('APR (with farming)') : t('APR')}
      </Text>
      {children}
    </Column>
  )
}

export function AprCalculatorV2({ poolAddress, chainId, tokenId, showTitle = true }: AprCalculatorV2Props) {
  return <PositionAprCalculator poolAddress={poolAddress} chainId={chainId} showTitle={showTitle} />
  // if (tokenId) {
  // return <PositionAprCalculator poolAddress={poolAddress} chainId={chainId} tokenId={tokenId} showTitle={showTitle} />
  // }
  // return <GlobalAprCalculator poolAddress={poolAddress} chainId={chainId} showTitle={showTitle} />
}

const GlobalAprCalculator: React.FC<AprCalculatorV2Props> = ({ poolAddress, chainId, showTitle }) => {
  const pool = usePoolInfo({ poolAddress, chainId })

  if (!pool) {
    return <Skeleton height="40px" />
  }

  return showTitle ? (
    <WithTitle pool={pool}>
      <PoolGlobalAprButton pool={pool} />
    </WithTitle>
  ) : (
    <PoolGlobalAprButton pool={pool} />
  )
}

const PositionAprCalculator: React.FC<AprCalculatorV2Props & { tokenId?: bigint }> = ({
  poolAddress,
  chainId,
  tokenId,
  showTitle,
}) => {
  const pool = usePoolInfo({ poolAddress, chainId })

  if (!pool) {
    return <Skeleton height="40px" />
  }

  return showTitle ? (
    <WithTitle pool={pool}>
      <V3PoolDerivedAprButton pool={pool} />
    </WithTitle>
  ) : (
    <V3PoolDerivedAprButton pool={pool} />
  )
}
