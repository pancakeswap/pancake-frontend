import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { useCallback, useEffect, useRef, useState } from 'react'
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
      <Flex paddingX="8px" pt="8px" pb="4px" justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Text color="textSubtle" fontSize="14px">
            {t('Esti total fees:')}
          </Text>

          <Text fontWeight="600" fontSize="14px" px="2px">
            {t('$%fees%', { fees: selectedQuote?.providerFee })}
          </Text>
          <BuyCryptoTooltip
            opacity={0.7}
            iconSize="17px"
            tooltipText={t('Note that Fees are just an estimation and may vary slightly when completing a purchase')}
          />
        </Flex>

        <Text color="primary" fontWeight="600" fontSize="14px">
          {t('Show details')}
        </Text>
      </Flex>
      <StyledNotificationWrapper ref={containerRef} show={show}>
        <Description ref={contentRef} show={show} elementHeight={elementHeight}>
          {selectedQuote &&
            providerFeeTypes[selectedQuote.provider].map((feeType: FeeTypes, index: number) => {
              return <FeeItem key={feeType} feeTitle={feeType} quote={selectedQuote} index={index} />
            })}
        </Description>
      </StyledNotificationWrapper>
    </StyledFeesContainer>
  )
}

const FeeItem = ({ feeTitle, quote }: { feeTitle: FeeTypes; quote: OnRampProviderQuote }) => {
  const { currentLanguage } = useTranslation()

  const FeeEstimates: {
    [feeType: string]: <T extends FeeComponents = FeeComponents>(args: T) => number
  } = {
    [FeeTypes.NetworkingFees]: (args) => args.networkFee,
    [FeeTypes.ProviderFees]: (args) => args.providerFee,
    [FeeTypes.ProviderRate]: () => quote.price,
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
            })}{' '}
            {quote.fiatCurrency}
          </Text>
        </Box>
      </Flex>
    </RowBetween>
  )
}
