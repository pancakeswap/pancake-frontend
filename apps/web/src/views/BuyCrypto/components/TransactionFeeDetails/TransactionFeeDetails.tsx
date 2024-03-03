import { useTranslation } from '@pancakeswap/localization'
import { ArrowDropDownIcon, Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from 'styled-components'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { Description, StyledFeesContainer, StyledNotificationWrapper } from 'views/BuyCrypto/styles'
import { OnRampProviderQuote } from 'views/BuyCrypto/types'
import { FeeTypes, providerFeeTypes } from '../../constants'
import BuyCryptoTooltip from '../Tooltip/Tooltip'

type FeeComponents = { providerFee: number; networkFee: number }
interface TransactionFeeDetailsProps {
  selectedQuote: OnRampProviderQuote | undefined
}

export const TransactionFeeDetails = ({ selectedQuote }: TransactionFeeDetailsProps) => {
  const [elementHeight, setElementHeight] = useState<number>(50)
  const [show, setShow] = useState<boolean>(false)

  const containerRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { t, currentLanguage } = useTranslation()

  const handleExpandClick = useCallback(() => setShow(!show), [show])

  useEffect(() => {
    const elRef = contentRef.current
    if (elRef) setElementHeight(elRef.scrollHeight)
  }, [contentRef.current?.scrollHeight])

  return (
    <StyledFeesContainer width="100%" onClick={handleExpandClick}>
      <Flex paddingLeft="8px" justifyContent="space-between" opacity={0.5}>
        <Text pt="8px" pb="4px" fontSize="14px" color="text3">
          {t('Show transaction details')}
        </Text>
        <ArrowDropDownIcon scale="lg" />
      </Flex>
      <StyledNotificationWrapper ref={containerRef} show={show}>
        <Description ref={contentRef} show={show} elementHeight={elementHeight}>
          <RowBetween>
            <Text fontSize="14px">
              {selectedQuote?.cryptoCurrency} {t('price')}
            </Text>
            <Text ml="4px" fontSize="13px">
              = {formatLocaleNumber({ number: Number(selectedQuote?.price), locale: currentLanguage.locale })}{' '}
              {selectedQuote?.fiatCurrency}
            </Text>
          </RowBetween>
          {selectedQuote &&
            providerFeeTypes[selectedQuote.provider].map((feeType: FeeTypes, index: number) => {
              return <FeeItem key={feeType} feeTitle={feeType} quote={selectedQuote} index={index} />
            })}
        </Description>
      </StyledNotificationWrapper>
    </StyledFeesContainer>
  )
}

const FeeItem = ({ feeTitle, quote, index }: { feeTitle: FeeTypes; quote: OnRampProviderQuote; index: number }) => {
  const { t, currentLanguage } = useTranslation()
  const theme = useTheme()

  const FeeEstimates: {
    [feeType: string]: <T extends FeeComponents = FeeComponents>(args: T) => number
  } = {
    [FeeTypes.TotalFees]: (args) => args.networkFee + args.providerFee,
    [FeeTypes.NetworkingFees]: (args) => args.networkFee,
    [FeeTypes.ProviderFees]: (args) => args.providerFee,
  }

  const Dot: JSX.Element = (
    <div
      style={{
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        background: `${theme.colors.textSubtle}`,
        marginRight: '2px',
      }}
    />
  )

  return (
    <RowBetween paddingLeft={index > 0 ? '8px' : '0px'}>
      <Flex alignItems="center" justifyContent="center">
        <Flex justifyContent="center" alignItems="center">
          {index > 0 && Dot}
          <Text fontSize="14px" color="textSubtle">
            {feeTitle}
          </Text>
        </Flex>
        {feeTitle === FeeTypes.TotalFees && (
          <BuyCryptoTooltip
            opacity={0.7}
            iconSize="17px"
            tooltipText={t('Note that Fees are just an estimation and may vary slightly when completing a purchase')}
          />
        )}
      </Flex>

      <Text ml="4px" fontSize="14px" color="textSubtle">
        {formatLocaleNumber({
          number: FeeEstimates[feeTitle](quote),
          locale: currentLanguage.locale,
        })}{' '}
        {quote.fiatCurrency}
      </Text>
    </RowBetween>
  )
}
