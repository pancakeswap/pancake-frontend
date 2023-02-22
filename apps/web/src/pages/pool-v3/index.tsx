import { AddIcon, Button, CardBody, CardFooter, Text, Dots, Card, Flex, Tag } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import styled from 'styled-components'
import { useWeb3React } from '@pancakeswap/wagmi'
import { AppBody, AppHeader } from 'components/App'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { CHAIN_IDS } from 'utils/wagmi'
import PositionListItem from 'views/AddLiquidityV3/formViews/V3FormView/components/PoolListItem'
import Page from 'views/Page'
import { useTranslation } from '@pancakeswap/localization'
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { Percent } from '@pancakeswap/sdk'
import RangeTag from 'views/AddLiquidityV3/formViews/V3FormView/components/RangeTag'
import useV2Pairs from 'hooks/useV2Pairs'
import useStableConfig, {
  StableConfigContext,
  useLPTokensWithBalanceByAccount,
} from 'views/Swap/StableSwap/hooks/useStableConfig'
import { useTokenBalance } from 'state/wallet/hooks'
import { useGetRemovedTokenAmounts } from 'views/RemoveLiquidity/RemoveStableLiquidity/hooks/useStableDerivedBurnInfo'
import useTotalSupply from 'hooks/useTotalSupply'
import { useTokensDeposited } from 'components/PositionCard'
import { Bound } from 'config/constants/types'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

export const StableContextProvider = (props) => {
  const stableConfig = useStableConfig({
    tokenA: props.pair?.token0,
    tokenB: props.pair?.token1,
  })

  if (!stableConfig.stableSwapConfig) return null

  return (
    <StableConfigContext.Provider value={stableConfig}>
      <StablePairCard {...props} />
    </StableConfigContext.Provider>
  )
}

function StablePairCard({ pair, account }) {
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const [token0Deposited, token1Deposited] = useGetRemovedTokenAmounts({
    lpAmount: userPoolBalance?.quotient?.toString(),
  })

  return (
    <Card mb="8px">
      <NextLink href={`/stable/${pair.liquidityToken.address}`}>
        <Flex justifyContent="space-between" p="16px">
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="4px">
              <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={20} />
              <Text bold ml="8px">
                {pair.token0.symbol}/{pair.token1.symbol} Stable LP
              </Text>
              <Tag ml="8px" variant="secondary" outline>
                {new Percent(pair.stableLpFee * 1000000, 1_000_000).toSignificant()}%
              </Tag>
            </Flex>
            <Text fontSize="14px" color="textSubtle">
              {token0Deposited?.toSignificant(6)} {pair.token0.symbol} / {token1Deposited?.toSignificant(6)}{' '}
              {pair.token1.symbol}
            </Text>
          </Flex>
          <Tag ml="8px" variant="secondary" outline>
            Stable LP
          </Tag>
        </Flex>
      </NextLink>
    </Card>
  )
}

function V2PairCard({ pair, account }) {
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] = useTokensDeposited({ pair, userPoolBalance, totalPoolTokens })

  return (
    <Card mb="8px">
      <NextLink href={`/pool-v2/${pair.token0.address}/${pair.token1.address}`}>
        <Flex justifyContent="space-between" p="16px">
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="4px">
              <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={20} />
              <Text bold ml="8px">
                {pair.token0.symbol}/{pair.token1.symbol} V2 LP
              </Text>
            </Flex>
            <Text fontSize="14px" color="textSubtle">
              {token0Deposited?.toSignificant(6)} {pair.token0.symbol} / {token1Deposited?.toSignificant(6)}{' '}
              {pair.token1.symbol}
            </Text>
          </Flex>
          <Tag ml="8px" variant="failure" outline>
            V2 LP
          </Tag>
        </Flex>
      </NextLink>
    </Card>
  )
}

export default function PoolListPage() {
  const { account } = useWeb3React()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { positions, loading: positionsLoading } = useV3Positions(account)

  const { data: v2Pairs } = useV2Pairs(account)

  const stablePairs = useLPTokensWithBalanceByAccount(account)

  let v2PairsSection = null

  if (v2Pairs?.length) {
    v2PairsSection = v2Pairs.map((pair) => <V2PairCard pair={pair} account={account} />)
  }

  let stablePairsSection = null

  if (stablePairs?.length) {
    stablePairsSection = stablePairs.map((pair) => <StableContextProvider pair={pair} account={account} />)
  }

  let v3PairsSection = null

  if (positionsLoading) {
    v3PairsSection = (
      <Text color="textSubtle" textAlign="center">
        <Dots>{t('Loading')}</Dots>
      </Text>
    )
  } else if (positions?.length) {
    v3PairsSection = positions.map((p) => {
      return (
        <PositionListItem key={p.tokenId.toString()} positionDetails={p}>
          {({
            currencyBase,
            currencyQuote,
            removed,
            outOfRange,
            priceLower,
            tickAtLimit,
            priceUpper,
            feeAmount,
            positionSummaryLink,
          }) => (
            <Card mb="8px">
              <NextLink href={positionSummaryLink}>
                <Flex justifyContent="space-between" p="16px">
                  <Flex flexDirection="column">
                    <Flex alignItems="center" mb="4px">
                      <DoubleCurrencyLogo currency0={currencyQuote} currency1={currencyBase} size={20} />
                      <Text bold ml="8px">
                        {!currencyQuote || !currencyBase ? (
                          <Dots>{t('Loading')}</Dots>
                        ) : (
                          `${currencyQuote.symbol}/${currencyBase.symbol}`
                        )}
                      </Text>
                      <Tag ml="8px" variant="secondary" outline>
                        {new Percent(feeAmount, 1_000_000).toSignificant()}%
                      </Tag>
                    </Flex>
                    <Text fontSize="14px" color="textSubtle">
                      Min {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale)} / Max:{' '}
                      {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale)} {currencyQuote?.symbol} per{' '}
                      {currencyBase?.symbol}
                    </Text>
                  </Flex>

                  <RangeTag removed={removed} outOfRange={outOfRange} />
                </Flex>
              </NextLink>
            </Card>
          )}
        </PositionListItem>
      )
    })
  } else {
    v3PairsSection = (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppHeader title="Your Liquidity" subtitle="List of your liquidity positions" />
        <Body>
          {v3PairsSection}
          {stablePairsSection}
          {v2PairsSection}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <NextLink href="/add" passHref>
            <Button id="join-pool-button" width="100%" startIcon={<AddIcon color="invertedContrast" />}>
              {t('Add Liquidity')}
            </Button>
          </NextLink>
        </CardFooter>
      </AppBody>
    </Page>
  )
}

PoolListPage.chains = CHAIN_IDS
