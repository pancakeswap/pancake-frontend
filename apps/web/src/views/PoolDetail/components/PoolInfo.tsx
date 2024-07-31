import { useTranslation } from '@pancakeswap/localization'
import { ERC20Token, Native } from '@pancakeswap/sdk'
import { AutoColumn, Flex, FlexGap, Row, Text } from '@pancakeswap/uikit'
import { ChainLogo, DoubleCurrencyLogo, FeatureStack, FeeTierTooltip } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import { useChainIdByQuery, useChainNameByQuery } from 'state/info/hooks'
import { multiChainNameConverter } from 'utils/chainNameConverter'
import { Address, isAddressEqual, zeroAddress } from 'viem'
import { usePoolData } from '../hooks/usePoolData'
import { usePoolFee } from '../hooks/useStablePoolFee'

const FEE_TIER_DENOMINATOR_AMM = 1_000_000

export const PoolInfo = () => {
  const { t } = useTranslation()
  const poolData = usePoolData()
  const chainId = useChainIdByQuery()
  const networkName = useChainNameByQuery()
  const [currency0, currency1] = useMemo(() => {
    if (!poolData) return [undefined, undefined]
    const { token0, token1 } = poolData
    const _currency0 = isAddressEqual(token0.address as Address, zeroAddress)
      ? Native.onChain(chainId)
      : new ERC20Token(chainId, token0.address as Address, token0.decimals, token0.symbol, token0.name)
    const _currency1 = new ERC20Token(chainId, token1.address as Address, token1.decimals, token1.symbol, token1.name)
    return [_currency0, _currency1]
  }, [chainId, poolData])
  const { fee } = usePoolFee(poolData?.address as Address, poolData?.protocol)

  return (
    <Row justifyContent="space-between">
      <Flex alignItems="center">
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={48} innerMargin="-8px" />
        <FlexGap gap="4px" ml="12px">
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
        </FlexGap>
      </Flex>
      <FlexGap gap="16px">
        {poolData?.protocol ? (
          <AutoColumn rowGap="4px">
            <Text fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('fee tier')}
            </Text>
            <FeeTierTooltip type={poolData.protocol} percent={fee} />
          </AutoColumn>
        ) : null}
        <AutoColumn rowGap="4px">
          <Text fontSize={12} bold color="textSubtle" textTransform="uppercase">
            {t('network')}
          </Text>
          <FlexGap gap="4px">
            <ChainLogo chainId={chainId} />
            <Text fontSize={12} bold color="textSubtle" lineHeight="24px">
              {multiChainNameConverter(networkName)}
            </Text>
          </FlexGap>
        </AutoColumn>
        <AutoColumn rowGap="4px">
          <Text fontSize={12} bold color="textSubtle" textTransform="uppercase">
            {t('apr')}
          </Text>
          <Text>TODO</Text>
        </AutoColumn>
        <AutoColumn rowGap="4px">
          <Text fontSize={12} bold color="textSubtle" textTransform="uppercase">
            {t('pool type')}
          </Text>
          <FeatureStack features={[poolData?.protocol]} />
        </AutoColumn>
      </FlexGap>
    </Row>
  )
}
