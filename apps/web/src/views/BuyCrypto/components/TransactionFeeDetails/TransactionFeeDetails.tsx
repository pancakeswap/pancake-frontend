import { useTranslation } from '@pancakeswap/localization'
import type { Currency } from '@pancakeswap/swap-sdk-core'
import { ArrowDropDownIcon, ArrowDropUpIcon, Box, Flex, RowBetween, SkeletonText, Text } from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Field } from 'state/buyCrypto/actions'
import { useTheme } from 'styled-components'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import {
  Description,
  StyledArrowHead,
  StyledFeesContainer,
  StyledFeesContainer3,
  StyledNotificationWrapper,
} from 'views/BuyCrypto/styles'
import type { OnRampProviderQuote } from 'views/BuyCrypto/types'
import { FeeTypes, getNetworkFullName, providerFeeTypes } from '../../constants'
import { BtcLogo } from '../OnRampProviderLogo/OnRampProviderLogo'
import BuyCryptoTooltip from '../Tooltip/Tooltip'

type FeeComponents = { providerFee: number; networkFee: number; price: number }
interface TransactionFeeDetailsProps {
  selectedQuote: OnRampProviderQuote | undefined
  currency: Currency
  independentField: Field
  inputError: string | undefined
  quotesError: string | undefined
}

export const TransactionFeeDetails = ({
  selectedQuote,
  currency,
  independentField,
  inputError,
  quotesError,
}: TransactionFeeDetailsProps) => {
  const [elementHeight, setElementHeight] = useState<number>(51)
  const [show, setShow] = useState<boolean>(false)
  const theme = useTheme()
  const containerRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const handleExpandClick = useCallback(() => setShow(!show), [show])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const elRef = contentRef.current
    if (elRef) setElementHeight(elRef.scrollHeight)

    if (inputError || quotesError) {
      setShow(false)
      setElementHeight(0)
    }
  }, [selectedQuote, inputError, quotesError])

  return (
    <Flex flexDirection="column">
      <Flex width="100%" justifyContent="center" alignItems="center" paddingBottom="20px">
        <StyledFeesContainer3 justifyContent="center" alignItems="center">
          {currency?.chainId === 0 ? (
            <BtcLogo size={20} />
          ) : (
            <ChainLogo chainId={currency?.chainId} width={20} height={20} />
          )}
          <Text paddingLeft="6px">{getNetworkFullName(currency?.chainId)}</Text>
        </StyledFeesContainer3>
      </Flex>

      <StyledFeesContainer width="100%" onClick={handleExpandClick} disabled={Boolean(quotesError || inputError)}>
        <StyledArrowHead />
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            {selectedQuote && !quotesError ? (
              <>
                <Text fontWeight="600" fontSize="14px" px="2px">
                  {t('Est total fees:')}
                </Text>
                <SkeletonText loading={Boolean(inputError)} initialWidth={40} fontSize="14px">
                  {t('%fees%', {
                    fees: formatLocaleNumber({
                      number: Number((selectedQuote?.providerFee + selectedQuote?.networkFee).toFixed(2)),
                      locale,
                      options: { currency: selectedQuote.fiatCurrency, style: 'currency' },
                    }),
                  })}
                </SkeletonText>
              </>
            ) : (
              <Text fontWeight="600" fontSize="14px" px="2px">
                {quotesError}
              </Text>
            )}
            <BuyCryptoTooltip
              opacity={0.7}
              iconSize="17px"
              tooltipText={
                quotesError
                  ? t(
                      'Quotes may be unavailable for some assets based on market conditions and provider availability in your region.',
                    )
                  : t('Note that Fees are just an estimation and may vary slightly when completing a purchase')
              }
            />
          </Flex>

          {!quotesError && (
            <Flex alignItems="center" justifyContent="center">
              <Text color="primary" fontWeight="600" fontSize="14px">
                {!show ? t('Show details') : t('Hide Details')}
              </Text>
              {!show ? <ArrowDropDownIcon color="primary" /> : <ArrowDropUpIcon color="primary" />}
            </Flex>
          )}
        </Flex>
        <StyledNotificationWrapper ref={containerRef} show={show}>
          <Description ref={contentRef} show={show} elementHeight={elementHeight}>
            {selectedQuote &&
              providerFeeTypes[selectedQuote.provider].map((feeType: FeeTypes) => {
                return <FeeItem key={feeType} feeTitle={feeType} quote={selectedQuote} />
              })}
          </Description>
        </StyledNotificationWrapper>
      </StyledFeesContainer>
      {inputError && (
        <Text px="8px" pt="6px" fontSize="14px" color={theme.colors.failure} textAlign="center">
          {independentField === Field.INPUT ? inputError : ''}
        </Text>
      )}
    </Flex>
  )
}

const FeeItem = ({ feeTitle, quote }: { feeTitle: FeeTypes; quote: OnRampProviderQuote }) => {
  const { currentLanguage } = useTranslation()

  const FeeEstimates: {
    [feeType: string]: <T extends FeeComponents = FeeComponents>(args: T) => number
  } = {
    [FeeTypes.NetworkingFees]: (q) => q.networkFee,
    [FeeTypes.ProviderFees]: (q) => q.providerFee,
    [FeeTypes.ProviderRate]: (q) => q.price,
  }

  const title = feeTitle === FeeTypes.ProviderRate ? `${quote.cryptoCurrency} ${feeTitle}` : feeTitle
  return (
    <RowBetween py="4px">
      <Flex justifyContent="space-evenly" width="100%">
        <Box width="max-content">
          <Text width="max-content" fontSize="14px" color="textSubtle">
            {title}
          </Text>
        </Box>

        <Box
          borderBottom="1px solid cardBorder"
          borderBottomWidth={1}
          borderStyle="dotted"
          width="100%"
          mb="4px"
          mx="4px"
          opacity={0.3}
        />
        <Box width="max-content">
          <Text width="max-content" fontSize="14px" fontWeight="600">
            {formatLocaleNumber({
              number: FeeEstimates[feeTitle](quote),
              locale: currentLanguage.locale,
              options: { currency: quote.fiatCurrency, style: 'currency' },
            })}{' '}
          </Text>
        </Box>
      </Flex>
    </RowBetween>
  )
}
