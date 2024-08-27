import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, AutoRow, Box, Column, Flex, FlexGap, Grid, Spinner, Text } from '@pancakeswap/uikit'
import { ChainLogo, DoubleCurrencyLogo, FeatureStack, FeeTierTooltip } from '@pancakeswap/widgets-internal'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'
import { useChainIdByQuery, useChainNameByQuery } from 'state/info/hooks'
import styled from 'styled-components'
import { multiChainNameConverter } from 'utils/chainNameConverter'
import { PoolGlobalAprButton } from 'views/universalFarms/components/PoolAprButton'
import { usePoolInfoByQuery } from '../hooks/usePoolInfo'
import { MyPositions } from './MyPositions'
import { PoolCharts } from './PoolCharts'
import { PoolCurrencies } from './PoolCurrencies'
import { PoolStatus } from './PoolStatus'
import { Transactions } from './Transactions/Transactions'

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
`

export const PoolInfo = () => {
  const { t } = useTranslation()
  const poolInfo = usePoolInfoByQuery()
  const chainId = useChainIdByQuery()
  const networkName = useChainNameByQuery()
  const [currency0, currency1] = useMemo(() => {
    if (!poolInfo) return [undefined, undefined]
    const { token0, token1 } = poolInfo
    return [token0.wrapped, token1.wrapped]
  }, [poolInfo])
  const fee = useMemo(() => {
    return new Percent(poolInfo?.feeTier ?? 0n, poolInfo?.feeTierBase)
  }, [poolInfo?.feeTier, poolInfo?.feeTierBase])
  const { account } = useAccountActiveChain()

  if (!poolInfo)
    return (
      <Flex mt="80px" justifyContent="center">
        <Spinner />
      </Flex>
    )

  return (
    <Column gap="24px">
      <NextSeo title={`${currency0?.symbol} / ${currency1?.symbol}`} />
      <Header>
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
        <FlexGap gap="16px" flexWrap="wrap">
          {poolInfo?.protocol ? (
            <AutoColumn rowGap="4px">
              <Text fontSize={12} bold color="textSubtle" textTransform="uppercase">
                {t('fee tier')}
              </Text>
              <Box>
                <FeeTierTooltip type={poolInfo.protocol} percent={fee} />
              </Box>
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
            {poolInfo ? <PoolGlobalAprButton pool={poolInfo} /> : null}
          </AutoColumn>
          <AutoColumn rowGap="4px">
            <Text fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('pool type')}
            </Text>
            <FeatureStack features={[poolInfo?.protocol]} />
          </AutoColumn>
        </FlexGap>
      </Header>
      {account && poolInfo ? <MyPositions poolInfo={poolInfo} /> : null}

      <AutoRow gap="lg" flexWrap="wrap">
        <Text as="h3" fontWeight={600} fontSize={24}>
          {t('Pair info')}
        </Text>
        <PoolCurrencies poolInfo={poolInfo} />
      </AutoRow>

      <Grid gridGap="24px" gridTemplateColumns={['1fr', '1fr', '1fr', '1fr 2fr']}>
        <PoolStatus poolInfo={poolInfo} />
        <PoolCharts poolInfo={poolInfo} />
      </Grid>

      <Transactions protocol={poolInfo?.protocol} />
    </Column>
  )
}
