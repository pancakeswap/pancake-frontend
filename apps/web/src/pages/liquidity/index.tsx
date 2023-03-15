import {
  AddIcon,
  Button,
  CardBody,
  CardFooter,
  Text,
  Dots,
  Card,
  Flex,
  Tag,
  ButtonMenu,
  ButtonMenuItem,
  Checkbox,
} from '@pancakeswap/uikit'
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
import { Pair, Percent } from '@pancakeswap/sdk'
import { RangeTag } from 'components/RangeTag'
import useV2PairsByAccount from 'hooks/useV2Pairs'
import useStableConfig, {
  LPStablePair,
  StableConfigContext,
  useLPTokensWithBalanceByAccount,
} from 'views/Swap/StableSwap/hooks/useStableConfig'
import { Bound } from 'config/constants/types'
import { useMemo, useState } from 'react'
import { V2PairCard } from 'views/AddLiquidityV3/components/V2PairCard'
import { StablePairCard } from 'views/AddLiquidityV3/components/StablePairCard'
import FarmV3MigrationBanner from 'views/Home/components/Banners/FarmV3MigrationBanner'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

export const StableContextProvider = (props: { pair: LPStablePair; account: string }) => {
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

enum FILTER {
  ALL = 0,
  V3 = 1,
  STABLE = 2,
  V2 = 3,
}

export default function PoolListPage() {
  const { account } = useWeb3React()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const [selectedTypeIndex, setSelectedTypeIndex] = useState(FILTER.ALL)
  const [hideClosedPositions, setHideClosedPositions] = useState(false)

  const { positions, loading: v3Loading } = useV3Positions(account)

  const { data: v2Pairs, loading: v2Loading } = useV2PairsByAccount(account)

  const stablePairs = useLPTokensWithBalanceByAccount(account)

  let v2PairsSection = null

  if (v2Pairs?.length) {
    v2PairsSection = v2Pairs.map((pair) => (
      <V2PairCard key={Pair.getAddress(pair.token0, pair.token1)} pair={pair} account={account} />
    ))
  }

  let stablePairsSection = null

  if (stablePairs?.length) {
    stablePairsSection = stablePairs.map((pair) => (
      <StableContextProvider key={pair.lpAddress} pair={pair} account={account} />
    ))
  }

  let v3PairsSection = null

  if (positions?.length) {
    v3PairsSection = positions
      .filter((p) => (hideClosedPositions ? p.liquidity?.gt(0) : true))
      .map((p) => {
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
                            `${currencyQuote.symbol}-${currencyBase.symbol} LP`
                          )}
                        </Text>
                        <Text ml="4px">{`(#${p.tokenId.toString()})`}</Text>
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
  }

  const mainSection = useMemo(() => {
    let resultSection = null
    if (v3Loading || v2Loading) {
      resultSection = (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    } else if (!v2PairsSection && !stablePairsSection && !v3PairsSection) {
      resultSection = (
        <Text color="textSubtle" textAlign="center">
          {t('No liquidity found.')}
        </Text>
      )
    } else {
      // Order should be v3, stable, v2
      const sections = [v3PairsSection, stablePairsSection, v2PairsSection]

      resultSection = selectedTypeIndex ? sections.filter((_, index) => selectedTypeIndex === index + 1) : sections
    }

    return resultSection
  }, [selectedTypeIndex, stablePairsSection, t, v2Loading, v2PairsSection, v3Loading, v3PairsSection])

  return (
    <Page>
      <Flex m="24px 0" maxWidth="854px">
        <FarmV3MigrationBanner />
      </Flex>
      <AppBody
        style={{
          maxWidth: '854px',
        }}
      >
        <AppHeader
          title="Your Liquidity"
          subtitle="List of your liquidity positions"
          filter={
            <>
              <Flex alignItems="center">
                <Checkbox
                  scale="sm"
                  name="confirmed"
                  type="checkbox"
                  checked={hideClosedPositions}
                  onChange={() => setHideClosedPositions((prev) => !prev)}
                />
                <Text ml="8px" color="textSubtle" fontSize="14px">
                  Hide closed positions
                </Text>
              </Flex>

              <ButtonMenu
                scale="sm"
                activeIndex={selectedTypeIndex}
                onItemClick={(index) => setSelectedTypeIndex(index)}
                variant="subtle"
              >
                <ButtonMenuItem>{t('All')}</ButtonMenuItem>
                <ButtonMenuItem>V3</ButtonMenuItem>
                <ButtonMenuItem>{t('StableSwap')}</ButtonMenuItem>
                <ButtonMenuItem>V2</ButtonMenuItem>
              </ButtonMenu>
            </>
          }
        />
        <Body>{mainSection}</Body>
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
