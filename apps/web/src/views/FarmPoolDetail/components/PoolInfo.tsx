import { ERC20Token, Native } from '@pancakeswap/sdk'
import { AutoRow, Column, Flex, Text } from '@pancakeswap/uikit'
import { DoubleCurrencyLogo } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import { useChainIdByQuery } from 'state/info/hooks'
import { Address, isAddressEqual, zeroAddress } from 'viem'
import { usePoolData } from '../hooks/usePoolData'

export const PoolInfo = () => {
  const poolData = usePoolData()
  const chainId = useChainIdByQuery()
  const [currency0, currency1] = useMemo(() => {
    if (!poolData) return [undefined, undefined]
    const { token0, token1 } = poolData
    const _currency0 = isAddressEqual(token0.address as Address, zeroAddress)
      ? Native.onChain(chainId)
      : new ERC20Token(chainId, token0.address as Address, token0.decimals, token0.symbol, token0.name)
    const _currency1 = new ERC20Token(chainId, token1.address as Address, token1.decimals, token1.symbol, token1.name)
    return [_currency0, _currency1]
  }, [chainId, poolData])

  return (
    <Column>
      <Flex alignItems="center">
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={48} innerMargin="-8px" />
        <AutoRow gap="4px" ml="20px">
          <Text bold fontSize={40}>
            {currency0?.symbol}
          </Text>
          <Text color="textSubtle" bold fontSize={40}>
            {' '}
            /{' '}
          </Text>
          <Text bold fontSize={40}>
            {currency1?.symbol}
          </Text>
        </AutoRow>
      </Flex>
    </Column>
  )
}
