import { Protocol } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMemo } from 'react'
import { useAccountPositionDetailByPool } from 'state/farmsV4/hooks'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useChainIdByQuery } from 'state/info/hooks'
import { useV2CakeEarning, useV3CakeEarning } from 'views/universalFarms/hooks/useCakeEarning'

type PoolEarningsProps = {
  earningsBusd: number
}

const PoolEarnings: React.FC<PoolEarningsProps> = ({ earningsBusd }) => {
  const { t } = useTranslation()
  return (
    <AutoColumn>
      <Text color="secondary" fontWeight={600} textTransform="uppercase">
        {t('total earning')}
      </Text>
      <Text as="h3" fontWeight={600} fontSize={24}>
        ${formatNumber(earningsBusd)}
      </Text>
    </AutoColumn>
  )
}

export const V2PoolEarnings: React.FC<{ pool: PoolInfo | null | undefined }> = ({ pool }) => {
  const { earningsBusd } = useV2CakeEarning(pool)

  return <PoolEarnings earningsBusd={earningsBusd} />
}

export const V3PoolEarnings: React.FC<{ pool: PoolInfo | null | undefined }> = ({ pool }) => {
  const chainId = useChainIdByQuery()
  const { account } = useAccountActiveChain()
  const { data } = useAccountPositionDetailByPool<Protocol.V3>(chainId, account, pool ?? undefined)
  const tokenIds = useMemo(() => {
    if (!data) return []
    return data.filter((item) => item.isStaked).map((item) => item.tokenId)
  }, [data])
  const { earningsBusd } = useV3CakeEarning(tokenIds)

  return <PoolEarnings earningsBusd={earningsBusd} />
}
