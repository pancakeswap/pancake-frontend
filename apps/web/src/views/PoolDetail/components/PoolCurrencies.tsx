import { Flex, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import styled from 'styled-components'
import { formatAmount } from 'utils/formatInfoNumbers'
import { getTokenSymbolAlias } from 'utils/getTokenAlias'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'

const TokenButton = styled(Flex)`
  padding: 8px 0px;
  margin-right: 16px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

type PoolCurrenciesProps = {
  poolInfo?: PoolInfo | null
}
export const PoolCurrencies: React.FC<PoolCurrenciesProps> = ({ poolInfo }) => {
  const chainPath = useMultiChainPath()
  const chainName = useChainNameByQuery()
  const stableSwapUrlQuery = useMemo(() => {
    return poolInfo?.protocol === 'stable' ? '?type=stableSwap' : ''
  }, [poolInfo?.protocol])
  const [symbol0, symbol1] = useMemo(() => {
    const s0 = getTokenSymbolAlias(poolInfo?.token0.wrapped.address, poolInfo?.chainId, poolInfo?.token0.symbol)
    const s1 = getTokenSymbolAlias(poolInfo?.token1.wrapped.address, poolInfo?.chainId, poolInfo?.token1.symbol)
    return [s0, s1]
  }, [
    poolInfo?.chainId,
    poolInfo?.token0.symbol,
    poolInfo?.token0.wrapped.address,
    poolInfo?.token1.symbol,
    poolInfo?.token1.wrapped.address,
  ])

  const hasSmallDifference = useMemo(() => {
    const { token0Price = 0, token1Price = 0 } = poolInfo ?? {}
    return poolInfo ? Math.abs(Number(token1Price) - Number(token0Price)) < 1 : false
  }, [poolInfo])

  if (!poolInfo) {
    return null
  }

  return (
    <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
      <Flex flexDirection={['column', 'column', 'row']}>
        <NextLinkFromReactRouter
          to={`/info${chainPath}/tokens/${poolInfo.token0.wrapped.address}${stableSwapUrlQuery}`}
        >
          <TokenButton>
            <CurrencyLogo address={poolInfo.token0.wrapped.address} size="24px" chainName={chainName} />
            <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
              {`1 ${symbol0} =  ${formatAmount(Number(poolInfo.token1Price ?? 0), {
                notation: 'standard',
                displayThreshold: 0.001,
                tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
              })} ${symbol1}`}
            </Text>
          </TokenButton>
        </NextLinkFromReactRouter>
        <NextLinkFromReactRouter to={`/info${chainPath}/tokens/${poolInfo.token1.address}${stableSwapUrlQuery}`}>
          <TokenButton ml={[null, null, '10px']}>
            <CurrencyLogo address={poolInfo.token1.address} size="24px" chainName={chainName} />
            <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
              {`1 ${symbol1} =  ${formatAmount(Number(poolInfo.token0Price ?? 0), {
                notation: 'standard',
                displayThreshold: 0.001,
                tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
              })} ${symbol0}`}
            </Text>
          </TokenButton>
        </NextLinkFromReactRouter>
      </Flex>
    </Flex>
  )
}
