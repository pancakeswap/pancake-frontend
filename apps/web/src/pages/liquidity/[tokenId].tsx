import { ChainId, Currency, CurrencyAmount, Fraction, Percent, Price, Token } from '@pancakeswap/sdk'
import { isActiveV3Farm } from '@pancakeswap/farms'
import {
  AutoColumn,
  AutoRow,
  Box,
  Button,
  Card,
  CardBody,
  ConfirmationModalContent,
  ExpandableLabel,
  Flex,
  Heading,
  LinkExternal,
  NextLinkFromReactRouter,
  NotFound,
  PreTitle,
  RowBetween,
  Spinner,
  SyncAltIcon,
  Tag,
  Text,
  Toggle,
  Message,
  useMatchBreakpoints,
  useModal,
} from '@pancakeswap/uikit'
import { MasterChefV3, NonfungiblePositionManager, Position } from '@pancakeswap/v3-sdk'
import { AppHeader } from 'components/App'
import { useToken } from 'hooks/Tokens'
import { useFarm } from 'hooks/useFarm'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePool } from 'hooks/v3/usePools'
import { NextSeo } from 'next-seo'
// import { usePositionTokenURI } from 'hooks/v3/usePositionTokenURI'
import { Trans, useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import { LightGreyCard } from 'components/Card'
import FormattedCurrencyAmount from 'components/Chart/FormattedCurrencyAmount/FormattedCurrencyAmount'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { RangePriceSection } from 'components/RangePriceSection'
import { RangeTag } from 'components/RangeTag'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { Bound } from 'config/constants/types'
import { gql } from 'graphql-request'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { PoolState } from 'hooks/v3/types'
import { useV3PositionFees } from 'hooks/v3/useV3PositionFees'
import { useV3PositionFromTokenId, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { memo, ReactNode, useCallback, useMemo, useState } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useIsTransactionPending, useTransactionAdder } from 'state/transactions/hooks'
import styled from 'styled-components'
import useSWRImmutable from 'swr/immutable'
import { calculateGasMargin, getBlockExploreLink } from 'utils'
import currencyId from 'utils/currencyId'
import { formatCurrencyAmount, formatPrice } from 'utils/formatCurrencyAmount'
import { v3Clients } from 'utils/graphql'
import { CHAIN_IDS } from 'utils/wagmi'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { AprCalculator } from 'views/AddLiquidityV3/components/AprCalculator'
import RateToggle from 'views/AddLiquidityV3/formViews/V3FormView/components/RateToggle'
import Page from 'views/Page'
import { useSendTransaction, useWalletClient } from 'wagmi'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { hexToBigInt } from 'viem'
import { getViemClients } from 'utils/viem'

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
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const [collecting, setCollecting] = useState<boolean>(false)
  const [collectMigrationHash, setCollectMigrationHash] = useState<string | null>(null)
  const [receiveWETH, setReceiveWETH] = useState(false)

  const { data: signer } = useWalletClient()
  const { sendTransactionAsync } = useSendTransaction()

  const { account, chainId } = useAccountActiveChain()

  const router = useRouter()
  const { tokenId: tokenIdFromUrl } = router.query

  const parsedTokenId = tokenIdFromUrl ? BigInt(tokenIdFromUrl as string) : undefined

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

  const removed = liquidity === 0n

  // const metadata = usePositionTokenURI(parsedTokenId)

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)
  const { data: farmDetail } = useFarm({ currencyA: token0, currencyB: token1, feeAmount })
  const hasActiveFarm = useMemo(
    () => farmDetail && isActiveV3Farm(farmDetail.farm, farmDetail.poolLength),
    [farmDetail],
  )

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // construct Position from details returned
  const [poolState, pool] = usePool(token0 ?? undefined, token1 ?? undefined, feeAmount)
  const position = useMemo(() => {
    if (pool && typeof liquidity === 'bigint' && typeof tickLower === 'number' && typeof tickUpper === 'number') {
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

  const inverted = token1 && token1 ? base?.equals(token1) : undefined
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
  const price0 = useStablecoinPrice(token0 ?? undefined, { enabled: !!feeValue0 })
  const price1 = useStablecoinPrice(token1 ?? undefined, { enabled: !!feeValue1 })

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
  const { tokenIds: stakedTokenIds, loading: tokenIdsInMCv3Loading } = useV3TokenIdsByAccount(
    masterchefV3?.address,
    account,
  )

  const isStakedInMCv3 = tokenId && Boolean(stakedTokenIds.find((id) => id === tokenId))

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
      !tokenId
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
      value: hexToBigInt(value),
      account,
      chain: signer.chain,
    }

    getViemClients({ chainId })
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gas: calculateGasMargin(estimate),
        }

        return sendTransactionAsync(newTxn).then((response) => {
          setCollectMigrationHash(response.hash)
          setCollecting(false)

          const amount0 = feeValue0 ?? CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0)
          const amount1 = feeValue1 ?? CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0)

          addTransaction(
            { hash: response.hash },
            {
              type: 'collect-fee',
              summary: `Collect fee ${amount0.toExact()} ${
                currency0ForFeeCollectionPurposes.symbol
              } and ${amount1.toExact()} ${currency1ForFeeCollectionPurposes.symbol}`,
            },
          )
        })
      })
      ?.catch((error) => {
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
    interfaceManager,
    feeValue0,
    feeValue1,
    manager.address,
    signer,
    sendTransactionAsync,
    addTransaction,
  ])

  const owner = useSingleCallResult({
    contract: tokenId ? positionManager : null,
    functionName: 'ownerOf',
    args: [tokenId],
  }).result
  const ownsNFT = owner === account || positionDetails?.operator === account

  const feeValueUpper = inverted ? feeValue0 : feeValue1
  const feeValueLower = inverted ? feeValue1 : feeValue0

  const positionValueUpper = inverted ? position?.amount0 : position?.amount1
  const positionValueLower = inverted ? position?.amount1 : position?.amount0
  const priceValueUpper = inverted ? price0 : price1
  const priceValueLower = inverted ? price1 : price0

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
            <Text color="textSubtle" ml="4px">
              {feeValueUpper?.currency?.symbol}
            </Text>
          </Flex>
          <Text>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4, locale) : '-'}</Text>
        </AutoRow>
        <AutoRow justifyContent="space-between">
          <Flex>
            <CurrencyLogo currency={feeValueLower?.currency} size="24px" />
            <Text color="textSubtle" ml="4px">
              {feeValueLower?.currency?.symbol}
            </Text>
          </Flex>
          <Text>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4, locale) : '-'}</Text>
        </AutoRow>
      </LightGreyCard>
      <Text mb="16px" px="16px">
        {t('Collecting fees will withdraw currently available fees for you')}
      </Text>
    </>
  )

  const [onClaimFee] = useModal(
    <TransactionConfirmationModal
      title={t('Claim fees')}
      attemptingTxn={collecting}
      hash={collectMigrationHash ?? ''}
      content={() => (
        <ConfirmationModalContent
          topContent={modalHeader}
          bottomContent={() => (
            <Button width="100%" onClick={collect}>
              {t('Collect')}
            </Button>
          )}
        />
      )}
      pendingText={t('Collecting fees')}
    />,
    true,
    true,
    'TransactionConfirmationModalColelctFees',
  )

  const isLoading = loading || poolState === PoolState.LOADING || poolState === PoolState.INVALID || !feeAmount

  const { isMobile } = useMatchBreakpoints()

  const isOwnNFT = isStakedInMCv3 || ownsNFT

  if (!isLoading && poolState === PoolState.NOT_EXISTS) {
    return <NotFound />
  }

  const farmingTips =
    hasActiveFarm && !isStakedInMCv3 ? (
      <Message variant="primary" mb="2em">
        <Box>
          <Text display="inline" bold mr="0.25em">{`${currencyQuote?.symbol}-${currencyBase?.symbol}`}</Text>
          <Text display="inline">
            {t(
              'has an active PancakeSwap farm. Stake your position in the farm to start earning with the indicated APR with CAKE farming.',
            )}
          </Text>
          <NextLinkFromReactRouter to="/farms">
            <Text display="inline" bold ml="0.25em" style={{ textDecoration: 'underline' }}>
              {t('Go to Farms')} {' >>'}
            </Text>
          </NextLinkFromReactRouter>
        </Box>
      </Message>
    ) : null

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
                <Box mb={['8px', '8px', 0]} width="100%" style={{ flex: 1 }} minWidth={['auto', , 'max-content']}>
                  <Flex alignItems="center">
                    <DoubleCurrencyLogo size={24} currency0={currencyQuote} currency1={currencyBase} />
                    <Heading as="h2" ml="8px">
                      {currencyQuote?.symbol}-{currencyBase?.symbol}
                    </Heading>
                    {!isMobile && (
                      <>
                        {isStakedInMCv3 && (
                          <Tag ml="8px" outline variant="warning">
                            {t('Farming')}
                          </Tag>
                        )}
                        <RangeTag ml="8px" removed={removed} outOfRange={!inRange} />
                      </>
                    )}
                  </Flex>
                  <RowBetween gap="16px" flexWrap="nowrap">
                    <Text fontSize="14px" color="textSubtle" style={{ wordBreak: 'break-word' }}>
                      V3 LP #{tokenIdFromUrl} / {new Percent(feeAmount || 0, 1_000_000).toSignificant()}%{' '}
                      {t('fee tier')}
                    </Text>
                    {isMobile && (
                      <Flex>
                        {isStakedInMCv3 && (
                          <Tag mr="8px" outline variant="warning">
                            {t('Farming')}
                          </Tag>
                        )}
                        <RangeTag removed={removed} outOfRange={!inRange} />
                      </Flex>
                    )}
                  </RowBetween>
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
                      <Button disabled={!isOwnNFT} width="100%">
                        {t('Add')}
                      </Button>
                    </NextLinkFromReactRouter>
                    {!removed && (
                      <NextLinkFromReactRouter to={`/remove/${tokenId}`}>
                        <Button disabled={!isOwnNFT} ml="4px" variant="secondary" width="100%">
                          {t('Remove')}
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
                    <Button disabled={!isOwnNFT} width="100%" mb="8px">
                      {t('Add')}
                    </Button>
                  </NextLinkFromReactRouter>
                  {!removed && (
                    <NextLinkFromReactRouter to={`/remove/${tokenId}`}>
                      <Button disabled={!isOwnNFT} variant="secondary" width="100%" mb="8px">
                        {t('Remove')}
                      </Button>
                    </NextLinkFromReactRouter>
                  )}
                </>
              )}
              {farmingTips}
              <AutoRow>
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  mb="8px"
                  style={{ gap: '16px' }}
                  flexWrap={['wrap', 'wrap', 'nowrap']}
                >
                  <Box width="100%" mb={['8px', '8px', 0]} position="relative">
                    <Flex position="absolute" right={0}>
                      <AprCalculator
                        allowApply={false}
                        showQuestion
                        baseCurrency={currencyBase}
                        quoteCurrency={currencyQuote}
                        feeAmount={feeAmount}
                        positionDetails={positionDetails}
                        defaultDepositUsd={fiatValueOfLiquidity?.toFixed(2)}
                        tokenAmount0={inRange ? position?.amount0 : undefined}
                        tokenAmount1={inRange ? position?.amount1 : undefined}
                      />
                    </Flex>
                    <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
                      {t('Liquidity')}
                    </Text>

                    <Text fontSize="24px" fontWeight={600} mb="8px">
                      $
                      {fiatValueOfLiquidity?.greaterThan(new Fraction(1, 100))
                        ? fiatValueOfLiquidity.toFixed(2, { groupSeparator: ',' })
                        : '-'}
                    </Text>
                    <LightGreyCard
                      mr="4px"
                      style={{
                        padding: '16px 8px',
                      }}
                    >
                      <AutoRow justifyContent="space-between" mb="8px">
                        <Flex>
                          <CurrencyLogo currency={currencyQuote} />
                          <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                            {unwrappedToken(positionValueUpper?.currency)?.symbol}
                          </Text>
                        </Flex>
                        <Flex justifyContent="center">
                          <Text small mr="4px">
                            <FormattedCurrencyAmount currencyAmount={positionValueUpper} />
                          </Text>
                        </Flex>
                        <RowBetween justifyContent="flex-end">
                          <Text fontSize="10px" color="textSubtle" mr="4px">
                            {positionValueUpper && priceValueUpper
                              ? `~$${priceValueUpper
                                  .quote(positionValueUpper?.wrapped)
                                  .toFixed(2, { groupSeparator: ',' })}`
                              : ''}
                          </Text>
                        </RowBetween>
                      </AutoRow>
                      <AutoRow justifyContent="space-between">
                        <Flex>
                          <CurrencyLogo currency={currencyBase} />
                          <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                            {unwrappedToken(positionValueLower?.currency)?.symbol}
                          </Text>
                        </Flex>
                        <Flex justifyContent="center">
                          <Text small mr="4px">
                            <FormattedCurrencyAmount currencyAmount={positionValueLower} />
                          </Text>
                        </Flex>
                        <RowBetween justifyContent="flex-end">
                          <Text fontSize="10px" color="textSubtle" mr="4px">
                            {positionValueLower && priceValueLower
                              ? `~$${priceValueLower
                                  .quote(positionValueLower?.wrapped)
                                  .toFixed(2, { groupSeparator: ',' })}`
                              : ''}
                          </Text>
                        </RowBetween>
                      </AutoRow>
                    </LightGreyCard>
                  </Box>
                  <Box width="100%">
                    <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
                      {t('Unclaim Fees')}
                    </Text>
                    <AutoRow justifyContent="space-between" mb="8px">
                      <Text fontSize="24px" fontWeight={600}>
                        $
                        {fiatValueOfFees?.greaterThan(new Fraction(1, 100))
                          ? fiatValueOfFees.toFixed(2, { groupSeparator: ',' })
                          : '-'}
                      </Text>

                      <Button
                        scale="sm"
                        disabled={
                          !isOwnNFT ||
                          collecting ||
                          isCollectPending ||
                          !(feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) || !!collectMigrationHash)
                        }
                        onClick={onClaimFee}
                      >
                        {!!collectMigrationHash && !isCollectPending
                          ? t('Collected')
                          : isCollectPending || collecting
                          ? t('Collecting...')
                          : t('Collect')}
                      </Button>
                    </AutoRow>
                    <LightGreyCard
                      mr="4px"
                      style={{
                        padding: '16px 8px',
                      }}
                    >
                      <AutoRow justifyContent="space-between" mb="8px">
                        <Flex>
                          <CurrencyLogo currency={feeValueUpper?.currency} />
                          <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                            {feeValueUpper?.currency?.symbol}
                          </Text>
                        </Flex>
                        <Flex justifyContent="center">
                          <Text small>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4, locale) : '-'}</Text>
                        </Flex>
                        <RowBetween justifyContent="flex-end">
                          <Text fontSize="10px" color="textSubtle" ml="4px">
                            {feeValueUpper && priceValueUpper
                              ? `~$${priceValueUpper.quote(feeValueUpper?.wrapped).toFixed(2, { groupSeparator: ',' })}`
                              : ''}
                          </Text>
                        </RowBetween>
                      </AutoRow>
                      <AutoRow justifyContent="space-between">
                        <Flex>
                          <CurrencyLogo currency={feeValueLower?.currency} />
                          <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                            {feeValueLower?.currency?.symbol}
                          </Text>
                        </Flex>
                        <Flex justifyContent="center">
                          <Text small>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4, locale) : '-'}</Text>
                        </Flex>
                        <RowBetween justifyContent="flex-end">
                          <Text fontSize="10px" color="textSubtle" ml="4px">
                            {feeValueLower && priceValueLower
                              ? `~$${priceValueLower.quote(feeValueLower?.wrapped).toFixed(2, { groupSeparator: ',' })}`
                              : ''}
                          </Text>
                        </RowBetween>
                      </AutoRow>
                    </LightGreyCard>
                  </Box>
                </Flex>
              </AutoRow>
              {showCollectAsWeth && (
                <Flex mb="8px">
                  <Flex ml="auto" alignItems="center">
                    <Text mr="8px">
                      {t('Collect as')} {nativeWrappedSymbol}
                    </Text>
                    <Toggle
                      id="receive-as-weth"
                      scale="sm"
                      checked={receiveWETH}
                      onChange={() => setReceiveWETH((prevState) => !prevState)}
                    />
                  </Flex>
                </Flex>
              )}
              <AutoRow justifyContent="space-between" mb="16px" mt="24px">
                <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
                  {t('Price Range')}
                </Text>
                {currencyBase && currencyQuote && (
                  <RateToggle
                    currencyA={currencyBase}
                    handleRateToggle={() => setManuallyInverted(!manuallyInverted)}
                  />
                )}
              </AutoRow>
              <AutoRow mb="8px">
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  flexWrap={['wrap', 'wrap', 'nowrap']}
                >
                  <RangePriceSection
                    mr={['0', '0', '16px']}
                    mb={['8px', '8px', '0']}
                    title={t('Min Price')}
                    price={formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale)}
                    currency0={currencyQuote}
                    currency1={currencyBase}
                  />
                  {isMobile ? null : <SyncAltIcon width="24px" mx="16px" />}
                  <RangePriceSection
                    ml={['0', '0', '16px']}
                    title={t('Max Price')}
                    price={formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale)}
                    currency0={currencyQuote}
                    currency1={currencyBase}
                  />
                </Flex>
              </AutoRow>
              {pool && currencyQuote && currencyBase ? (
                <RangePriceSection
                  title={t('Current Price')}
                  currency0={currencyQuote}
                  currency1={currencyBase}
                  price={formatPrice(inverted ? pool.token1Price : pool.token0Price, 6, locale)}
                />
              ) : null}
              {positionDetails && currency0 && currency1 && (
                <PositionHistory
                  tokenId={positionDetails.tokenId.toString()}
                  currency0={currency0}
                  currency1={currency1}
                />
              )}
            </CardBody>
          </>
        )}
      </BodyWrapper>
    </Page>
  )
}

PoolPage.chains = CHAIN_IDS

type PositionTX = {
  id: string
  amount0: string
  amount1: string
  timestamp: string
  logIndex: string
}

type PositionHistoryResult = {
  positionSnapshots: {
    id: string
    transaction: {
      mints: PositionTX[]
      burns: PositionTX[]
      collects: PositionTX[]
    }
  }[]
}

const PositionHistory = memo(PositionHistory_)

function PositionHistory_({
  tokenId,
  currency0,
  currency1,
}: {
  tokenId: string
  currency0: Currency
  currency1: Currency
}) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const { chainId } = useActiveChainId()
  const client = v3Clients[chainId as ChainId]
  const { data, isLoading } = useSWRImmutable(
    client && tokenId && ['positionHistory', chainId, tokenId],
    async () => {
      const result = await client.request<PositionHistoryResult>(
        gql`
          query positionHistory($tokenId: String!) {
            positionSnapshots(where: { position: $tokenId }, orderBy: timestamp, orderDirection: desc, first: 30) {
              id
              transaction {
                mints(where: { or: [{ amount0_gt: "0" }, { amount1_gt: "0" }] }) {
                  id
                  timestamp
                  amount1
                  amount0
                  logIndex
                }
                burns(where: { or: [{ amount0_gt: "0" }, { amount1_gt: "0" }] }) {
                  id
                  timestamp
                  amount1
                  amount0
                  logIndex
                }
                collects(where: { or: [{ amount0_gt: "0" }, { amount1_gt: "0" }] }) {
                  id
                  timestamp
                  amount0
                  amount1
                  logIndex
                }
              }
            }
          }
        `,
        {
          tokenId,
        },
      )

      return result.positionSnapshots.filter((snapshot) => {
        const { transaction } = snapshot
        if (transaction.mints.length > 0 || transaction.burns.length > 0 || transaction.collects.length > 0) {
          return true
        }
        return false
      })
    },
    {
      revalidateOnMount: true,
      refreshInterval: 30_000,
    },
  )

  if (isLoading || !data?.length) {
    return null
  }

  return (
    <AtomBox textAlign="center" pt="16px">
      <ExpandableLabel
        expanded={isExpanded}
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
      >
        {isExpanded ? t('Hide') : t('History')}
      </ExpandableLabel>
      {isExpanded && (
        <AtomBox display="grid" gap="16px">
          <AtomBox display="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }} alignItems="center">
            <PreTitle>{t('Timestamp')}</PreTitle>
            <PreTitle>{t('Action')}</PreTitle>
            <PreTitle>{t('Token Transferred')}</PreTitle>
          </AtomBox>

          {data.map((d) => {
            return (
              <AutoColumn key={d.id} gap="16px">
                {d.transaction.mints.map((positionTx) => (
                  <PositionHistoryRow
                    chainId={chainId}
                    positionTx={positionTx}
                    key={positionTx.id}
                    type="mint"
                    currency0={currency0}
                    currency1={currency1}
                  />
                ))}
                {d.transaction.collects
                  .map((collectTx) => {
                    const foundSameTxBurn = d.transaction.burns.find(
                      (burnTx) =>
                        +collectTx.amount0 >= +burnTx.amount0 &&
                        +collectTx.amount1 >= +burnTx.amount1 &&
                        +burnTx.logIndex < +collectTx.logIndex,
                    )
                    if (foundSameTxBurn) {
                      if (
                        foundSameTxBurn.amount0 === collectTx.amount0 &&
                        foundSameTxBurn.amount1 === collectTx.amount1
                      ) {
                        return null
                      }
                      return {
                        ...collectTx,
                        amount0: String(+collectTx.amount0 - +foundSameTxBurn.amount0),
                        amount1: String(+collectTx.amount1 - +foundSameTxBurn.amount1),
                      }
                    }
                    return collectTx
                  })
                  .filter(Boolean)
                  .map((positionTx) => (
                    <PositionHistoryRow
                      chainId={chainId}
                      positionTx={positionTx}
                      key={positionTx.id}
                      type="collect"
                      currency0={currency0}
                      currency1={currency1}
                    />
                  ))}
                {d.transaction.burns.map((positionTx) => (
                  <PositionHistoryRow
                    chainId={chainId}
                    positionTx={positionTx}
                    key={positionTx.id}
                    type="burn"
                    currency0={currency0}
                    currency1={currency1}
                  />
                ))}
              </AutoColumn>
            )
          })}
        </AtomBox>
      )}
    </AtomBox>
  )
}

type PositionHistoryType = 'mint' | 'burn' | 'collect'
const positionHistoryTypeText = {
  mint: <Trans>Add Liquidity</Trans>,
  burn: <Trans>Remove Liquidity</Trans>,
  collect: <Trans>Collect fee</Trans>,
} satisfies Record<PositionHistoryType, ReactNode>

function PositionHistoryRow({
  chainId,
  positionTx,
  type,
  currency0,
  currency1,
}: {
  chainId: ChainId
  positionTx: PositionTX
  type: PositionHistoryType
  currency0: Currency
  currency1: Currency
}) {
  const { isMobile } = useMatchBreakpoints()

  const date = new Date(+positionTx.timestamp * 1_000)

  const isPlus = type !== 'burn'

  if (isMobile) {
    return (
      <Box>
        <AutoRow gap="8px">
          <LinkExternal isBscScan href={getBlockExploreLink(positionTx.id, 'transaction', chainId)}>
            <Text ellipsis>{dayjs(+positionTx.timestamp * 1_000).format('YYYY/MM/DD')}</Text>
          </LinkExternal>
        </AutoRow>
        <Text>{positionHistoryTypeText[type]}</Text>
        <AutoColumn gap="4px">
          {+positionTx.amount0 > 0 && (
            <AutoRow flexWrap="nowrap" gap="12px" justifyContent="space-between">
              <AutoRow width="auto" flexWrap="nowrap" gap="4px">
                <AtomBox minWidth="24px">
                  <CurrencyLogo currency={currency0} />
                </AtomBox>
                <Text display={['none', , 'block']}>{currency0.symbol}</Text>
              </AutoRow>
              <Text bold ellipsis title={positionTx.amount0}>
                {isPlus ? '+' : '-'}{' '}
                {(+positionTx.amount0).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                  maximumSignificantDigits: 6,
                })}
              </Text>
            </AutoRow>
          )}
          {+positionTx.amount1 > 0 && (
            <AutoRow flexWrap="nowrap" gap="12px" justifyContent="space-between">
              <AutoRow width="auto" flexWrap="nowrap" gap="4px">
                <AtomBox minWidth="24px">
                  <CurrencyLogo currency={currency1} />
                </AtomBox>
                <Text display={['none', , 'block']}>{currency1.symbol}</Text>
              </AutoRow>
              <Text bold ellipsis title={positionTx.amount1}>
                {isPlus ? '+' : '-'}{' '}
                {(+positionTx.amount1).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                  maximumSignificantDigits: 6,
                })}
              </Text>
            </AutoRow>
          )}
        </AutoColumn>
      </Box>
    )
  }

  return (
    <AtomBox
      display="grid"
      style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
      gap="16px"
      alignItems="center"
      borderTop="1"
      p="16px"
    >
      <AutoRow justifyContent="center" gap="8px">
        <LinkExternal isBscScan href={getBlockExploreLink(positionTx.id, 'transaction', chainId)}>
          <Text ellipsis>{date.toLocaleString()}</Text>
        </LinkExternal>
      </AutoRow>
      <Text>{positionHistoryTypeText[type]}</Text>
      <AutoColumn gap="4px">
        {+positionTx.amount0 > 0 && (
          <AutoRow flexWrap="nowrap" justifyContent="flex-end" gap="12px">
            <Text bold ellipsis title={positionTx.amount0}>
              {isPlus ? '+' : '-'}{' '}
              {(+positionTx.amount0).toLocaleString(undefined, {
                maximumFractionDigits: 6,
                maximumSignificantDigits: 6,
              })}
            </Text>
            <AutoRow width="auto" flexWrap="nowrap" gap="4px">
              <AtomBox minWidth="24px">
                <CurrencyLogo currency={currency0} />
              </AtomBox>
              <Text display={['none', , 'block']}>{currency0.symbol}</Text>
            </AutoRow>
          </AutoRow>
        )}
        {+positionTx.amount1 > 0 && (
          <AutoRow flexWrap="nowrap" justifyContent="flex-end" gap="12px">
            <Text bold ellipsis title={positionTx.amount1}>
              {isPlus ? '+' : '-'}{' '}
              {(+positionTx.amount1).toLocaleString(undefined, {
                maximumFractionDigits: 6,
                maximumSignificantDigits: 6,
              })}
            </Text>
            <AutoRow width="auto" flexWrap="nowrap" gap="4px">
              <AtomBox minWidth="24px">
                <CurrencyLogo currency={currency1} />
              </AtomBox>
              <Text display={['none', , 'block']}>{currency1.symbol}</Text>
            </AutoRow>
          </AutoRow>
        )}
      </AutoColumn>
    </AtomBox>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { tokenId } = params

  const isNumberReg = /^\d+$/

  if (!(tokenId as string)?.match(isNumberReg)) {
    return {
      redirect: {
        statusCode: 303,
        destination: `/add`,
      },
    }
  }

  return {
    props: {},
  }
}
