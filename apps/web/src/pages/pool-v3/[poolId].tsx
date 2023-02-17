import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Fraction, Price, Token } from '@pancakeswap/sdk'
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
} from '@pancakeswap/uikit'
import { NonfungiblePositionManager, Position } from '@pancakeswap/v3-sdk'
import { AppHeader } from 'components/App'
import { useToken } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
// import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePool } from 'hooks/v3/usePools'
// import { usePositionTokenURI } from 'hooks/v3/usePositionTokenURI'
import { useV3PositionFees } from 'hooks/v3/useV3PositionFees'
import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
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
import { CurrencyLogo } from 'components/Logo'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { TransactionResponse } from '@ethersproject/providers'
import RangeTag from 'views/AddLiquidityV3/components/RangeTag'
import RateToggle from 'views/AddLiquidityV3/components/RateToggle'
import { useSingleCallResult } from 'state/multicall/hooks'
import useNativeCurrency from 'hooks/useNativeCurrency'

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

function getRatio(
  lower: Price<Currency, Currency>,
  current: Price<Currency, Currency>,
  upper: Price<Currency, Currency>,
) {
  try {
    if (!current.greaterThan(lower)) {
      return 100
    }

    if (!current.lessThan(upper)) {
      return 0
    }

    const a = Number.parseFloat(lower.toSignificant(15))
    const b = Number.parseFloat(upper.toSignificant(15))
    const c = Number.parseFloat(current.toSignificant(15))

    const ratio = Math.floor((1 / ((Math.sqrt(a * b) - Math.sqrt(b * c)) / (c - Math.sqrt(b * c)) + 1)) * 100)

    if (ratio < 0 || ratio > 100) {
      throw Error('Out of range')
    }

    return ratio
  } catch {
    return undefined
  }
}

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

  const { position: positionDetails } = useV3PositionFromTokenId(parsedTokenId)

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
  const [, pool] = usePool(token0 ?? undefined, token1 ?? undefined, feeAmount)
  const position = useMemo(() => {
    if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  // const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

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

  const ratio = useMemo(() => {
    return priceLower && pool && priceUpper
      ? getRatio(
          inverted ? priceUpper.invert() : priceLower,
          pool.token0Price,
          inverted ? priceLower.invert() : priceUpper,
        )
      : undefined
  }, [inverted, pool, priceLower, priceUpper])

  // fees
  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, positionDetails?.tokenId, receiveWETH)

  // these currencies will match the feeValue{0,1} currencies for the purposes of fee collection
  const currency0ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token0 : unwrappedToken(pool.token0)) : undefined
  const currency1ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token1 : unwrappedToken(pool.token1)) : undefined

  const isCollectPending = useIsTransactionPending(collectMigrationHash ?? undefined)

  // usdc prices always in terms of tokens
  const price0 = useBUSDPrice(token0 ?? undefined)
  const price1 = useBUSDPrice(token1 ?? undefined)

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

  const collect = useCallback(() => {
    if (
      !currency0ForFeeCollectionPurposes ||
      !currency1ForFeeCollectionPurposes ||
      !chainId ||
      !positionManager ||
      !account ||
      !tokenId ||
      !provider
    )
      return

    setCollecting(true)

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = NonfungiblePositionManager.collectCallParameters({
      tokenId: tokenId.toString(),
      expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0),
      expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0),
      recipient: account,
    })

    const txn = {
      to: positionManager.address,
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
    currency0ForFeeCollectionPurposes,
    currency1ForFeeCollectionPurposes,
    chainId,
    positionManager,
    account,
    tokenId,
    provider,
    feeValue0,
    feeValue1,
    signer,
    addTransaction,
  ])

  const owner = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId?.toString()]).result?.[0]
  const ownsNFT = owner === account || positionDetails?.operator === account

  const feeValueUpper = inverted ? feeValue0 : feeValue1
  const feeValueLower = inverted ? feeValue1 : feeValue0

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
        <AutoRow justifyContent="space-between">
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

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          title={`${currencyQuote?.symbol} / ${currencyBase?.symbol} - ${inRange ? 'In Range' : 'Out of Range'}`}
          backTo="/pool-v3"
          noConfig
          buttons={
            currency0 &&
            currency1 && (
              <>
                <NextLinkFromReactRouter
                  to={`/increase/${currencyId(currency0)}/${currencyId(currency1)}/${feeAmount}/${tokenId}`}
                >
                  <Button width="100%">Add</Button>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter to={`/remove/${tokenId}`}>
                  <Button ml="16px" variant="secondary" width="100%">
                    Remove
                  </Button>
                </NextLinkFromReactRouter>
              </>
            )
          }
        />
        <CardBody>
          <AutoRow>
            <Flex alignItems="center" justifyContent="space-between" width="100%" mb="8px">
              <Box width="100%" mr="4px">
                <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
                  Liquidity
                </Text>

                <Text fontSize="24px" fontWeight={500}>
                  {fiatValueOfLiquidity?.greaterThan(new Fraction(1, 100))
                    ? fiatValueOfLiquidity.toFixed(2, { groupSeparator: ',' })
                    : '$-'}
                </Text>
                <LightGreyCard mr="4px">
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={currencyQuote} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {currencyQuote?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text bold mr="4px">
                        {inverted ? position?.amount0.toSignificant(4) : position?.amount1.toSignificant(4)}
                      </Text>
                      <Text>{inverted ? ratio : 100 - ratio}%</Text>
                    </Flex>
                  </AutoRow>
                  <AutoRow justifyContent="space-between">
                    <Flex>
                      <CurrencyLogo currency={currencyBase} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {currencyBase?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text bold mr="4px">
                        {inverted ? position?.amount1.toSignificant(4) : position?.amount0.toSignificant(4)}
                      </Text>
                      <Text>{inverted ? 100 - ratio : ratio}%</Text>
                    </Flex>
                  </AutoRow>
                </LightGreyCard>
              </Box>
              <Box width="100%" ml="4px">
                <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
                  Unclaim Fees
                </Text>
                <AutoRow justifyContent="space-between">
                  <Text fontSize="24px" fontWeight={500}>
                    {fiatValueOfFees?.greaterThan(new Fraction(1, 100))
                      ? fiatValueOfFees.toFixed(2, { groupSeparator: ',' })
                      : '$-'}
                  </Text>

                  {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) || !!collectMigrationHash ? (
                    <Button scale="sm" disabled={collecting || isCollectPending} onClick={onClaimFee}>
                      {!!collectMigrationHash && !isCollectPending
                        ? 'Collected'
                        : isCollectPending || collecting
                        ? 'Collecting...'
                        : 'Collect fees'}
                    </Button>
                  ) : null}
                </AutoRow>
                <LightGreyCard mr="4px">
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={feeValue0?.currency} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {feeValue0?.currency?.symbol}
                      </Text>
                    </Flex>
                    <Text small bold>
                      {feeValue0?.toSignificant(6) || '0'}
                    </Text>
                  </AutoRow>
                  <AutoRow justifyContent="space-between">
                    <Flex>
                      <CurrencyLogo currency={feeValue1?.currency} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {feeValue1?.currency?.symbol}
                      </Text>
                    </Flex>
                    <Text small bold>
                      {feeValue1?.toSignificant(6) || '0'}
                    </Text>
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
                  checked={receiveWETH}
                  onChange={() => setReceiveWETH((prevState) => !prevState)}
                />
              </Flex>
            </Flex>
          )}
          <AutoRow justifyContent="space-between" mb="8px">
            <Flex>
              <Text>Price Range</Text>
              <RangeTag removed={removed} outOfRange={!inRange} />
            </Flex>
            {currencyBase && currencyQuote && (
              <RateToggle currencyA={currencyBase} handleRateToggle={() => setManuallyInverted(!manuallyInverted)} />
            )}
          </AutoRow>
          <AutoRow mb="8px">
            <Flex alignItems="center" justifyContent="space-between" width="100%">
              <LightGreyCard
                mr="4px"
                style={{
                  textAlign: 'center',
                }}
              >
                <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
                  MIN PRICE
                </Text>
                {tickLower}
                <Text fontSize="12px" color="textSubtle" bold>
                  {currencyQuote?.symbol} per {currencyBase?.symbol}
                </Text>
                {inRange && (
                  <Text fontSize="12px">Your position will be 100% {currencyBase?.symbol} at this price.</Text>
                )}
              </LightGreyCard>
              <LightGreyCard
                ml="4px"
                style={{
                  textAlign: 'center',
                }}
              >
                <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
                  MAX PRICE
                </Text>
                {tickUpper}
                <Text fontSize="12px" color="textSubtle" bold>
                  {currencyQuote?.symbol} per {currencyBase?.symbol}
                </Text>
                {inRange && (
                  <Text fontSize="12px">Your position will be 100% {currencyQuote?.symbol} at this price.</Text>
                )}
              </LightGreyCard>
            </Flex>
          </AutoRow>
          {pool && currencyQuote && currencyBase ? (
            <LightGreyCard style={{ textAlign: 'center' }}>
              <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
                CURRENT PRICE
              </Text>
              <Text>{(inverted ? pool.token1Price : pool.token0Price).toSignificant(6)}</Text>
              <Text fontSize="12px" color="textSubtle" bold>
                {currencyQuote?.symbol} per {currencyBase?.symbol}
              </Text>
            </LightGreyCard>
          ) : null}
        </CardBody>
      </BodyWrapper>
    </Page>
  )
}

PoolPage.chains = CHAIN_IDS
