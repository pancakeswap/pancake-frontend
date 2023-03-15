import { BigNumber } from '@ethersproject/bignumber'
import { NextSeo } from 'next-seo'
import { Currency, CurrencyAmount, Fraction, Percent, Price, Token } from '@pancakeswap/sdk'
import {
  Button,
  Card,
  CardBody,
  useModal,
  Text,
  AutoRow,
  Flex,
  Box,
  NextLinkFromReactRouter,
  ConfirmationModalContent,
  Toggle,
  Heading,
  SyncAltIcon,
  Spinner,
  useMatchBreakpoints,
  NotFound,
} from '@pancakeswap/uikit'
import { MasterChefV3, NonfungiblePositionManager, Position } from '@pancakeswap/v3-sdk'
import { AppHeader } from 'components/App'
import { useToken } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePool } from 'hooks/v3/usePools'
// import { usePositionTokenURI } from 'hooks/v3/usePositionTokenURI'
import { useV3PositionFees } from 'hooks/v3/useV3PositionFees'
import { useV3PositionFromTokenId, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { useTransactionAdder, useIsTransactionPending } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils'
import currencyId from 'utils/currencyId'
import { CHAIN_IDS } from 'utils/wagmi'
import { unwrappedToken } from 'utils/wrappedCurrency'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import Page from 'views/Page'
import { useSigner } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { LightGreyCard } from 'components/Card'
import { RangePriceSection } from 'components/RangePriceSection'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { TransactionResponse } from '@ethersproject/providers'
import RangeTag from 'views/AddLiquidityV3/formViews/V3FormView/components/RangeTag'
import RateToggle from 'views/AddLiquidityV3/formViews/V3FormView/components/RateToggle'
import { useSingleCallResult } from 'state/multicall/hooks'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { Bound } from 'config/constants/types'
import { PoolState } from 'hooks/v3/types'
import FormattedCurrencyAmount from 'components/Chart/FormattedCurrencyAmount/FormattedCurrencyAmount'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 858px;
  width: 100%;
  z-index: 1;
`

const useInverter = ({
  priceLower,
  priceUpper,
  quote,
  base,
  invert,
}: {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
  invert?: boolean
}): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} => {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base,
  }
}

// function getRatio(
//   lower: Price<Currency, Currency>,
//   current: Price<Currency, Currency>,
//   upper: Price<Currency, Currency>,
// ) {
//   try {
//     if (!current.greaterThan(lower)) {
//       return 100
//     }

//     if (!current.lessThan(upper)) {
//       return 0
//     }

//     const a = Number.parseFloat(lower.toSignificant(15))
//     const b = Number.parseFloat(upper.toSignificant(15))
//     const c = Number.parseFloat(current.toSignificant(15))

//     const ratio = Math.floor((1 / ((Math.sqrt(a * b) - Math.sqrt(b * c)) / (c - Math.sqrt(b * c)) + 1)) * 100)

//     if (ratio < 0 || ratio > 100) {
//       throw Error('Out of range')
//     }

//     return ratio
//   } catch {
//     return undefined
//   }
// }

export default function PoolPage() {
  const {
    currentLanguage: { locale },
  } = useTranslation()

  const [collecting, setCollecting] = useState<boolean>(false)
  const [collectMigrationHash, setCollectMigrationHash] = useState<string | null>(null)
  const [receiveWETH, setReceiveWETH] = useState(false)

  const { data: signer } = useSigner()

  const { account, chainId, provider } = useActiveWeb3React()

  const router = useRouter()
  const { poolId: tokenIdFromUrl } = router.query

  const parsedTokenId = tokenIdFromUrl ? BigNumber.from(tokenIdFromUrl) : undefined

  const { loading, position: positionDetails } = useV3PositionFromTokenId(parsedTokenId)

  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    tokenId,
  } = positionDetails || {}

  const removed = liquidity?.eq(0)

  // const metadata = usePositionTokenURI(parsedTokenId)

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // construct Position from details returned
  const [poolState, pool] = usePool(token0 ?? undefined, token1 ?? undefined, feeAmount)
  const position = useMemo(() => {
    if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position)

  const [manuallyInverted, setManuallyInverted] = useState(false)

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  })

  const inverted = token1 ? base?.equals(token1) : undefined
  const currencyQuote = inverted ? currency0 : currency1
  const currencyBase = inverted ? currency1 : currency0

  // const ratio = useMemo(() => {
  //   return priceLower && pool && priceUpper
  //     ? getRatio(
  //         inverted ? priceUpper.invert() : priceLower,
  //         pool.token0Price,
  //         inverted ? priceLower.invert() : priceUpper,
  //       )
  //     : undefined
  // }, [inverted, pool, priceLower, priceUpper])

  // fees
  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, positionDetails?.tokenId, receiveWETH)

  // these currencies will match the feeValue{0,1} currencies for the purposes of fee collection
  const currency0ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token0 : unwrappedToken(pool.token0)) : undefined
  const currency1ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token1 : unwrappedToken(pool.token1)) : undefined

  const isCollectPending = useIsTransactionPending(collectMigrationHash ?? undefined)

  // usdc prices always in terms of tokens
  const price0 = useStablecoinPrice(token0 ?? undefined)
  const price1 = useStablecoinPrice(token1 ?? undefined)

  const fiatValueOfFees: CurrencyAmount<Currency> | null = useMemo(() => {
    if (!price0 || !price1 || !feeValue0 || !feeValue1) return null

    // we wrap because it doesn't matter, the quote returns a USDC amount
    const feeValue0Wrapped = feeValue0?.wrapped
    const feeValue1Wrapped = feeValue1?.wrapped

    if (!feeValue0Wrapped || !feeValue1Wrapped) return null

    const amount0 = price0.quote(feeValue0Wrapped)
    const amount1 = price1.quote(feeValue1Wrapped)
    return amount0.add(amount1)
  }, [price0, price1, feeValue0, feeValue1])

  const fiatValueOfLiquidity: CurrencyAmount<Currency> | null = useMemo(() => {
    if (!price0 || !price1 || !position) return null
    const amount0 = price0.quote(position.amount0)
    const amount1 = price1.quote(position.amount1)

    return amount0.add(amount1)
  }, [price0, price1, position])

  const addTransaction = useTransactionAdder()

  const positionManager = useV3NFTPositionManagerContract()
  const masterchefV3 = useMasterchefV3()
  const { tokenIds: stakedTokenIds, loading: tokenIdsInMCv3Loading } = useV3TokenIdsByAccount(masterchefV3, account)

  const isStakedInMCv3 = tokenId && Boolean(stakedTokenIds.find((id) => id.eq(tokenId)))

  const manager = isStakedInMCv3 ? masterchefV3 : positionManager
  const interfaceManager = isStakedInMCv3 ? MasterChefV3 : NonfungiblePositionManager

  const collect = useCallback(() => {
    if (
      tokenIdsInMCv3Loading ||
      !currency0ForFeeCollectionPurposes ||
      !currency1ForFeeCollectionPurposes ||
      !chainId ||
      !positionManager ||
      !masterchefV3 ||
      !account ||
      !tokenId ||
      !provider
    )
      return

    setCollecting(true)

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = interfaceManager.collectCallParameters({
      tokenId: tokenId.toString(),
      expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0),
      expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0),
      recipient: account,
    })

    const txn = {
      to: manager.address,
      data: calldata,
      value,
    }

    signer
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return signer.sendTransaction(newTxn).then((response: TransactionResponse) => {
          setCollectMigrationHash(response.hash)
          setCollecting(false)

          addTransaction(response, {
            type: 'collect-fee',
            currencyId0: currencyId(currency0ForFeeCollectionPurposes),
            currencyId1: currencyId(currency1ForFeeCollectionPurposes),
            expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0).toExact(),
            expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0).toExact(),
          })
        })
      })
      .catch((error) => {
        setCollecting(false)
        console.error(error)
      })
  }, [
    tokenIdsInMCv3Loading,
    currency0ForFeeCollectionPurposes,
    currency1ForFeeCollectionPurposes,
    chainId,
    positionManager,
    masterchefV3,
    account,
    tokenId,
    provider,
    interfaceManager,
    feeValue0,
    feeValue1,
    manager.address,
    signer,
    addTransaction,
  ])

  const owner = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId?.toString()]).result?.[0]
  const ownsNFT = owner === account || positionDetails?.operator === account

  const feeValueUpper = inverted ? feeValue0 : feeValue1
  const feeValueLower = inverted ? feeValue1 : feeValue0

  const positionValueUpper = inverted ? position?.amount0 : position?.amount1
  const positionValueLower = inverted ? position?.amount1 : position?.amount0

  // check if price is within range
  const below = pool && typeof tickLower === 'number' ? pool.tickCurrent < tickLower : undefined
  const above = pool && typeof tickUpper === 'number' ? pool.tickCurrent >= tickUpper : undefined
  const inRange: boolean = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false

  const nativeCurrency = useNativeCurrency()
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol

  const showCollectAsWeth = Boolean(
    ownsNFT &&
      (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0)) &&
      currency0 &&
      currency1 &&
      (currency0.isNative || currency1.isNative) &&
      !collectMigrationHash,
  )

  const modalHeader = () => (
    <>
      <LightGreyCard mb="16px">
        <AutoRow justifyContent="space-between" mb="8px">
          <Flex>
            <CurrencyLogo currency={feeValueUpper?.currency} size="24px" />
            <Text color="primary" ml="4px">
              {feeValueUpper?.currency?.symbol}
            </Text>
          </Flex>
          <Text>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4, locale) : '-'}</Text>
        </AutoRow>
        <AutoRow justifyContent="space-between">
          <Flex>
            <CurrencyLogo currency={feeValueLower?.currency} size="24px" />
            <Text color="primary" ml="4px">
              {feeValueLower?.currency?.symbol}
            </Text>
          </Flex>
          <Text>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4, locale) : '-'}</Text>
        </AutoRow>
      </LightGreyCard>
      <Text mb="16px" px="16px">
        Collecting fees will withdraw currently available fees for you
      </Text>
    </>
  )

  const [onClaimFee] = useModal(
    <TransactionConfirmationModal
      title="Claim fees"
      attemptingTxn={collecting}
      hash={collectMigrationHash ?? ''}
      content={() => (
        <ConfirmationModalContent
          topContent={modalHeader}
          bottomContent={() => (
            <Button width="100%" onClick={collect}>
              Collect
            </Button>
          )}
        />
      )}
      pendingText="Collecting fees"
    />,
    true,
    true,
    'TransactionConfirmationModalColelctFees',
  )

  const isLoading = loading || poolState === PoolState.LOADING || poolState === PoolState.INVALID || !feeAmount

  const { isMobile } = useMatchBreakpoints()

  if (!isLoading && poolState === PoolState.NOT_EXISTS) {
    return <NotFound />
  }

  return (
    <Page>
      {!isLoading && <NextSeo title={`${currencyQuote?.symbol}-${currencyBase?.symbol} V3 LP #${tokenIdFromUrl}`} />}
      <BodyWrapper>
        {isLoading ? (
          <Flex width="100%" justifyContent="center" alignItems="center" minHeight="200px" mb="32px">
            <Spinner />
          </Flex>
        ) : (
          <>
            <AppHeader
              title={
                <Box mb={['8px', '8px', 0]}>
                  <Flex justifyContent="center" alignItems="center">
                    <DoubleCurrencyLogo size={24} currency0={currencyQuote} currency1={currencyBase} />
                    <Heading as="h2" ml="8px">
                      {currencyQuote?.symbol}-{currencyBase?.symbol}
                    </Heading>
                    <RangeTag removed={removed} outOfRange={!inRange} />
                  </Flex>
                  <Text fontSize="14px" color="textSubtle">
                    V3 LP #{tokenIdFromUrl} / {new Percent(feeAmount || 0, 1_000_000).toSignificant()}% fee tier
                  </Text>
                </Box>
              }
              backTo="/liquidity"
              noConfig
              buttons={
                !isMobile &&
                currency0 &&
                currency1 && (
                  <>
                    <NextLinkFromReactRouter
                      to={`/increase/${currencyId(currency0)}/${currencyId(currency1)}/${feeAmount}/${tokenId}`}
                    >
                      <Button width="100%">Add</Button>
                    </NextLinkFromReactRouter>
                    {!removed && (
                      <NextLinkFromReactRouter to={`/remove/${tokenId}`}>
                        <Button ml="16px" variant="secondary" width="100%">
                          Remove
                        </Button>
                      </NextLinkFromReactRouter>
                    )}
                  </>
                )
              }
            />
            <CardBody>
              {isMobile && (
                <>
                  <NextLinkFromReactRouter
                    to={`/increase/${currencyId(currency0)}/${currencyId(currency1)}/${feeAmount}/${tokenId}`}
                  >
                    <Button width="100%" mb="8px">
                      Add
                    </Button>
                  </NextLinkFromReactRouter>
                  {!removed && (
                    <NextLinkFromReactRouter to={`/remove/${tokenId}`}>
                      <Button variant="secondary" width="100%" mb="8px">
                        Remove
                      </Button>
                    </NextLinkFromReactRouter>
                  )}
                </>
              )}
              <AutoRow>
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  mb="8px"
                  flexWrap={['wrap', 'wrap', 'nowrap']}
                >
                  <Box width="100%" mr="4px" mb={['8px', '8px', 0]}>
                    <Text fontSize="16px" color="secondary" bold textTransform="uppercase">
                      Liquidity
                    </Text>

                    <Text fontSize="24px" fontWeight={500} mb="8px">
                      $
                      {fiatValueOfLiquidity?.greaterThan(new Fraction(1, 100))
                        ? fiatValueOfLiquidity.toFixed(2, { groupSeparator: ',' })
                        : '-'}
                    </Text>
                    <LightGreyCard mr="4px">
                      <AutoRow justifyContent="space-between" mb="8px">
                        <Flex>
                          <CurrencyLogo currency={currencyQuote} />
                          <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                            {positionValueUpper?.currency?.symbol}
                          </Text>
                        </Flex>
                        <Flex justifyContent="center">
                          <Text mr="4px">
                            <FormattedCurrencyAmount currencyAmount={positionValueUpper} />
                          </Text>
                        </Flex>
                      </AutoRow>
                      <AutoRow justifyContent="space-between">
                        <Flex>
                          <CurrencyLogo currency={currencyBase} />
                          <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                            {positionValueLower?.currency?.symbol}
                          </Text>
                        </Flex>
                        <Flex justifyContent="center">
                          <Text mr="4px">
                            <FormattedCurrencyAmount currencyAmount={positionValueLower} />
                          </Text>
                        </Flex>
                      </AutoRow>
                    </LightGreyCard>
                  </Box>
                  <Box width="100%" ml="4px">
                    <Text fontSize="16px" color="secondary" bold textTransform="uppercase">
                      Unclaim Fees
                    </Text>
                    <AutoRow justifyContent="space-between" mb="8px">
                      <Text fontSize="24px" fontWeight={500}>
                        $
                        {fiatValueOfFees?.greaterThan(new Fraction(1, 100))
                          ? fiatValueOfFees.toFixed(2, { groupSeparator: ',' })
                          : '-'}
                      </Text>

                      {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) || !!collectMigrationHash ? (
                        <Button scale="sm" disabled={collecting || isCollectPending} onClick={onClaimFee}>
                          {!!collectMigrationHash && !isCollectPending
                            ? 'Collected'
                            : isCollectPending || collecting
                            ? 'Collecting...'
                            : 'Collect'}
                        </Button>
                      ) : null}
                    </AutoRow>
                    <LightGreyCard mr="4px">
                      <AutoRow justifyContent="space-between" mb="8px">
                        <Flex>
                          <CurrencyLogo currency={feeValueUpper?.currency} />
                          <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                            {feeValueUpper?.currency?.symbol}
                          </Text>
                        </Flex>
                        <Text small>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4, locale) : '-'}</Text>
                      </AutoRow>
                      <AutoRow justifyContent="space-between">
                        <Flex>
                          <CurrencyLogo currency={feeValueLower?.currency} />
                          <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                            {feeValueLower?.currency?.symbol}
                          </Text>
                        </Flex>
                        <Text small>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4, locale) : '-'}</Text>
                      </AutoRow>
                    </LightGreyCard>
                  </Box>
                </Flex>
              </AutoRow>
              {showCollectAsWeth && (
                <Flex mb="8px">
                  <Flex ml="auto" alignItems="center">
                    <Text mr="8px">Collect as {nativeWrappedSymbol}</Text>
                    <Toggle
                      id="receive-as-weth"
                      scale="sm"
                      checked={receiveWETH}
                      onChange={() => setReceiveWETH((prevState) => !prevState)}
                    />
                  </Flex>
                </Flex>
              )}
              <AutoRow justifyContent="space-between" mb="8px" mt="24px">
                <Text fontSize="16px" color="secondary" bold textTransform="uppercase">
                  Price Range
                </Text>
                {currencyBase && currencyQuote && (
                  <RateToggle
                    currencyA={currencyBase}
                    handleRateToggle={() => setManuallyInverted(!manuallyInverted)}
                  />
                )}
              </AutoRow>
              <AutoRow mb="8px">
                <Flex alignItems="center" justifyContent="space-between" width="100%">
                  <RangePriceSection
                    mr="4px"
                    title="MIN PRICE"
                    price={formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale)}
                    currency0={currencyQuote}
                    currency1={currencyBase}
                  />

                  <SyncAltIcon width="24px" mx="8px" />
                  <RangePriceSection
                    ml="4px"
                    title="MAX PRICE"
                    price={formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale)}
                    currency0={currencyQuote}
                    currency1={currencyBase}
                  />
                </Flex>
              </AutoRow>
              {pool && currencyQuote && currencyBase ? (
                <RangePriceSection
                  title="CURRENT PRICE"
                  currency0={currencyQuote}
                  currency1={currencyBase}
                  price={(inverted ? pool.token1Price : pool.token0Price).toSignificant(6)}
                />
              ) : null}
            </CardBody>
          </>
        )}
      </BodyWrapper>
    </Page>
  )
}

PoolPage.chains = CHAIN_IDS
