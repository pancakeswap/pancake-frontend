import { Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useChainNameByQuery } from 'state/info/hooks'
import styled from 'styled-components'
import { formatAmount } from 'utils/formatInfoNumbers'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'

const StyledPoolTokens = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  border-radius: 16px;
`

const formatOptions = {
  displayThreshold: 0.001,
}

type PoolTokensProps = {
  poolInfo?: PoolInfo | null
}
export const PoolTokens: React.FC<PoolTokensProps> = ({ poolInfo }) => {
  const chainName = useChainNameByQuery()
  const [token0Tvl, token1Tvl] = useMemo(() => {
    if (!poolInfo?.tvlToken0 || !poolInfo?.tvlToken1) return [0, 0]
    return [
      formatAmount(Number(poolInfo.tvlToken0 ?? 0), formatOptions),
      formatAmount(Number(poolInfo.tvlToken1 ?? 0), formatOptions),
    ]
  }, [poolInfo?.tvlToken0, poolInfo?.tvlToken1])

  if (!poolInfo) {
    return null
  }

  return (
    <StyledPoolTokens>
      <RowBetween>
        <Flex>
          <CurrencyLogo address={poolInfo.token0.wrapped.address} size="20px" chainName={chainName} />
          <Text fontSize={14} ml="8px">
            {poolInfo.token0.wrapped.symbol}
          </Text>
        </Flex>
        <Text small>{token0Tvl}</Text>
      </RowBetween>
      <RowBetween>
        <Flex>
          <CurrencyLogo address={poolInfo.token1.wrapped.address} size="20px" chainName={chainName} />
          <Text fontSize={14} ml="8px">
            {poolInfo.token1.wrapped.symbol}
          </Text>
        </Flex>
        <Text small>{token1Tvl}</Text>
      </RowBetween>
    </StyledPoolTokens>
  )
}
