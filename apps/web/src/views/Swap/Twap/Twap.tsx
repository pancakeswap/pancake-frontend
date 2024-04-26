import { Orders, TWAP as PancakeTWAP } from '@orbs-network/twap-ui-pancake'
import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Price } from '@pancakeswap/sdk'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/swap-sdk-core'
import {
  ArrowUpIcon,
  AutoColumn,
  Box,
  BscScanIcon,
  Button,
  ChartDisableIcon,
  ChartIcon,
  ColumnCenter,
  Flex,
  IconButton,
  Link,
  Spinner,
  Text,
  useMatchBreakpoints,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useUserSingleHopOnly } from '@pancakeswap/utils/user'
import {
  ApproveModalContentV1,
  Swap,
  Swap as SwapUI,
  SwapTransactionReceiptModalContentV1,
} from '@pancakeswap/widgets-internal'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { BodyWrapper } from 'components/App/AppBody'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { CommonBasesType } from 'components/SearchModal/types'
import { useAllTokens, useCurrency } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useBestAMMTrade } from 'hooks/useBestAMMTrade'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useTheme } from 'next-themes'
import { ReactNode, useCallback, useContext, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import {
  useUserSplitRouteEnable,
  useUserStableSwapEnable,
  useUserV2SwapEnable,
  useUserV3SwapEnable,
} from 'state/user/smartRouter'
import { styled } from 'styled-components'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import currencyId from 'utils/currencyId'
import { useAccount } from 'wagmi'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { Wrapper } from '../components/styleds'
import { SwapTransactionErrorContent } from '../components/SwapTransactionErrorContent'
import useWarningImport from '../hooks/useWarningImport'
import { SwapFeaturesContext } from '../SwapFeaturesContext'
import { FormContainer } from '../V3Swap/components'

const useBestTrade = (fromToken?: string, toToken?: string, value?: string) => {
  const independentCurrency = useCurrency(fromToken)

  const amount = useMemo(() => {
    if (!independentCurrency || !value) return undefined
    if (value !== '0') {
      return CurrencyAmount.fromRawAmount(independentCurrency, BigInt(value))
    }
    return undefined
  }, [independentCurrency, value])

  const dependentCurrency = useCurrency(toToken)
  const [singleHopOnly] = useUserSingleHopOnly()
  const [split] = useUserSplitRouteEnable()
  const [v2Swap] = useUserV2SwapEnable()
  const [v3Swap] = useUserV3SwapEnable()
  const [stableSwap] = useUserStableSwapEnable()

  const { isLoading, trade } = useBestAMMTrade({
    amount,
    currency: dependentCurrency,
    baseCurrency: independentCurrency,
    tradeType: TradeType.EXACT_INPUT,
    maxHops: singleHopOnly ? 1 : undefined,
    maxSplits: split ? undefined : 0,
    v2Swap,
    v3Swap,
    stableSwap,
    type: 'auto',
    trackPerf: true,
  })

  return {
    isLoading: !value ? false : isLoading,
    outAmount: value ? trade?.outputAmount.numerator.toString() : '0',
  }
}

const useUsd = (address?: string) => {
  const currency = useCurrency(address)

  return useCurrencyUsdPrice(currency).data
}

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSubtle};
  overflow: hidden;
`

const useTokenModal = (
  onCurrencySelect: (value: Currency) => void,
  selectedCurrency?: Currency,
  otherSelectedCurrency?: Currency,
) => {
  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={selectedCurrency}
      otherSelectedCurrency={otherSelectedCurrency}
      showCommonBases
      commonBasesType={CommonBasesType.SWAP_LIMITORDER}
      showSearchInput
      mode="swap-currency-input"
    />,
  )

  return onPresentCurrencyModal
}

export function TWAPPanel({ limit }: { limit?: boolean }) {
  const { isDesktop } = useMatchBreakpoints()
  const { chainId } = useActiveChainId()
  const tokens = useAllTokens()
  const { connector, address } = useAccount()
  const { resolvedTheme } = useTheme()
  const { isChartSupported, isChartDisplayed, setIsChartDisplayed } = useContext(SwapFeaturesContext)
  const native = useNativeCurrency()
  const { onCurrencySelection } = useSwapActionHandlers()
  const warningSwapHandler = useWarningImport()

  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const handleCurrencySelect = useCallback(
    (isInput: boolean, newCurrency: Currency) => {
      onCurrencySelection(isInput ? Field.INPUT : Field.OUTPUT, newCurrency)
      warningSwapHandler(newCurrency)

      const oldCurrencyId = isInput ? inputCurrencyId : outputCurrencyId
      const otherCurrencyId = isInput ? outputCurrencyId : inputCurrencyId
      const newCurrencyId = currencyId(newCurrency)
      if (newCurrencyId === otherCurrencyId) {
        replaceBrowserHistory(isInput ? 'outputCurrency' : 'inputCurrency', oldCurrencyId)
      }
      replaceBrowserHistory(isInput ? 'inputCurrency' : 'outputCurrency', newCurrencyId)
    },
    [onCurrencySelection, warningSwapHandler, inputCurrencyId, outputCurrencyId],
  )

  const [, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()

  const toggleChartDisplayed = useCallback(() => {
    setIsChartDisplayed?.((currentIsChartDisplayed) => {
      if (!currentIsChartDisplayed) {
        setIsSwapHotTokenDisplay(false)
      }
      return !currentIsChartDisplayed
    })
  }, [setIsChartDisplayed, setIsSwapHotTokenDisplay])

  const onSrcTokenSelected = useCallback(
    (token: Currency) => {
      handleCurrencySelect(true, token)
    },
    [handleCurrencySelect],
  )

  const onDstTokenSelected = useCallback(
    (token: Currency) => {
      handleCurrencySelect(false, token)
    },
    [handleCurrencySelect],
  )

  return (
    <>
      <Header
        toggleChartDisplayed={toggleChartDisplayed}
        limit={limit}
        isChartSupported={isChartSupported}
        isChartDisplayed={isChartDisplayed}
      />

      <FormContainer>
        <PancakeTWAP
          ConnectButton={ConnectWalletButton}
          connectedChainId={chainId}
          account={address}
          limit={limit}
          usePriceUSD={useUsd}
          useTrade={useBestTrade}
          dappTokens={tokens}
          isDarkTheme={resolvedTheme === 'dark'}
          srcToken={inputCurrencyId}
          dstToken={outputCurrencyId}
          useTokenModal={useTokenModal}
          onSrcTokenSelected={onSrcTokenSelected}
          onDstTokenSelected={onDstTokenSelected}
          isMobile={!isDesktop}
          nativeToken={native}
          connector={connector}
          useTooltip={useTooltip}
          Button={Button}
          ApproveModalContent={ApproveModalContentV1}
          SwapTransactionErrorContent={SwapTransactionErrorContent}
          SwapPendingModalContent={SwapPendingModalContent}
          SwapTransactionReceiptModalContent={TwapSwapTransactionReceiptModalContent}
          AddToWallet={AddToWallet}
          TradePrice={TradePrice}
        />
      </FormContainer>
    </>
  )
}

const TradePrice = (props: {
  inputCurrency: Currency
  outputCurrency: Currency
  inputAmount: string
  outAmount: string
  loading?: boolean
}) => {
  const price = useMemo(() => {
    const inputAmountCurrency = CurrencyAmount.fromRawAmount(props.inputCurrency, BigInt(props.inputAmount))
    const outputAmountCurrency = CurrencyAmount.fromRawAmount(props.outputCurrency, BigInt(props.outAmount))
    return new Price(
      inputAmountCurrency.currency,
      outputAmountCurrency.currency,
      inputAmountCurrency.quotient,
      outputAmountCurrency.quotient,
    )
  }, [props.inputCurrency, props.outputCurrency, props.inputAmount, props.outAmount])

  if (!price) return null
  return <SwapUI.TradePrice loading={props.loading} price={price} />
}

export const SwapPendingModalContent: React.FC<{ title: string; showIcon?: boolean; children?: ReactNode }> = ({
  title,
  showIcon,
  children,
}) => {
  return (
    <Box width="100%">
      {showIcon ? (
        <Box margin="auto auto 36px auto" width="fit-content">
          <ArrowUpIcon color="success" width={80} height={80} />
        </Box>
      ) : (
        <Box mb="16px">
          <ColumnCenter>
            <Spinner />
          </ColumnCenter>
        </Box>
      )}
      <AutoColumn gap="12px" justify="center">
        <Text bold textAlign="center">
          {title}
        </Text>
        {children}
      </AutoColumn>
    </Box>
  )
}

const TwapSwapTransactionReceiptModalContent = ({ txHash, children }: { txHash: string; children: ReactNode }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  return (
    <SwapTransactionReceiptModalContentV1>
      {chainId && (
        <Link external small href={getBlockExploreLink(txHash, 'transaction', chainId)}>
          {t('View on %site%', { site: getBlockExploreName(chainId) })}: {truncateHash(txHash, 8, 0)}
          {chainId === ChainId.BSC && <BscScanIcon color="primary" ml="4px" />}
        </Link>
      )}
      {children}
    </SwapTransactionReceiptModalContentV1>
  )
}

const Header = ({
  toggleChartDisplayed,
  limit,
  isChartSupported,
  isChartDisplayed,
}: {
  toggleChartDisplayed: () => void
  limit?: boolean
  isChartSupported: boolean
  isChartDisplayed: boolean
}) => {
  return (
    <div>
      <Swap.CurrencyInputHeader
        title={
          <Flex alignItems="center" width="100%" justifyContent="space-between">
            <Swap.CurrencyInputHeaderTitle>{limit ? 'LIMIT' : 'TWAP'}</Swap.CurrencyInputHeaderTitle>
            {isChartSupported && (
              <ColoredIconButton
                onClick={() => {
                  toggleChartDisplayed()
                }}
                variant="text"
                scale="sm"
                data-dd-action-name="Price chart button"
              >
                {isChartDisplayed ? (
                  <ChartDisableIcon color="textSubtle" />
                ) : (
                  <ChartIcon width="24px" color="textSubtle" />
                )}
              </ColoredIconButton>
            )}
          </Flex>
        }
        subtitle={<></>}
      />
    </div>
  )
}

export const OrderHistory = () => {
  const { isDesktop } = useMatchBreakpoints()

  return (
    <BodyWrapper style={{ maxWidth: 'unset', marginTop: isDesktop ? 0 : 20 }}>
      <Wrapper id="swap-page" style={{ padding: 0 }}>
        <Orders />
      </Wrapper>
    </BodyWrapper>
  )
}

const AddToWallet = ({
  logo,
  symbol,
  address,
  decimals,
}: {
  address: string
  symbol: string
  decimals: number
  logo: string
}) => {
  return (
    <AddToWalletButton
      mt="39px"
      height="auto"
      variant="tertiary"
      width="fit-content"
      padding="6.5px 20px"
      marginTextBetweenLogo="6px"
      textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
      tokenAddress={address}
      tokenSymbol={symbol}
      tokenDecimals={decimals}
      tokenLogo={logo}
    />
  )
}
