import { useTranslation } from '@pancakeswap/localization'
import { Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { CryptoCard } from 'components/Card'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { FeeTypes, providerFeeTypes } from 'views/BuyCrypto/constants'
import { getRefValue } from 'views/BuyCrypto/hooks/useGetRefValue'
import { DropdownWrapper } from 'views/BuyCrypto/styles'
import { CryptoFormView, ProviderQuote } from 'views/BuyCrypto/types'
import OnRampProviderLogo from '../OnRampProviderLogo/OnRampProviderLogo'
import ProviderCampaign from '../ProviderCampaign/ProviderCampaign'
import BuyCryptoTooltip from '../Tooltip/Tooltip'

type FeeComponents = { providerFee: number; networkFee: number }

const FeeItem = ({ feeTitle, quote }: { feeTitle: FeeTypes; quote: ProviderQuote }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const FeeEstimates: {
    [feeType: string]: <T extends FeeComponents = FeeComponents>(args: T) => number
  } = {
    [FeeTypes.TotalFees]: (args) => args.networkFee + args.providerFee,
    [FeeTypes.NetworkingFees]: (args) => args.networkFee,
    [FeeTypes.ProviderFees]: (args) => args.providerFee,
  }

  return (
    <RowBetween>
      <Flex alignItems="center" justifyContent="center">
        <Text fontSize="14px" color="textSubtle">
          {feeTitle}
        </Text>
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
          locale,
        })}{' '}
        {quote.fiatCurrency}
      </Text>
    </RowBetween>
  )
}

const HeadingRow = ({ quote, quotesExist }: { quote: ProviderQuote; quotesExist: boolean }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const renderQuoteDetails = () => (
    <>
      <Text ml="4px" fontSize="18px" color="#7A6EAA" fontWeight="bold">
        {formatLocaleNumber({
          number: quote.quote,
          locale,
        })}{' '}
        {quote.cryptoCurrency}
      </Text>
      <RowBetween pt="12px">
        <Text fontSize="15px">
          {quote.cryptoCurrency} {t('rate')}
        </Text>
        <Text ml="4px" fontSize="16px">
          = {formatLocaleNumber({ number: Number(quote.price), locale })} {quote.fiatCurrency}
        </Text>
      </RowBetween>
    </>
  )

  return (
    <>
      <RowBetween>
        <OnRampProviderLogo provider={quote.provider} />
        {quotesExist ? (
          renderQuoteDetails()
        ) : (
          <BuyCryptoTooltip
            tooltipText={t(
              'Price quote from provider is currently unavailable. Please try again or try a different amount',
            )}
            tooltipHeading={t('No Quote')}
            iconSize="22px"
          />
        )}
      </RowBetween>
    </>
  )
}

function AccordionItem({
  active,
  toggleAccordianVisibility,
  quote,
  fetching,
  setModalView,
}: {
  active: boolean
  toggleAccordianVisibility: () => void
  quote: ProviderQuote
  fetching: boolean
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<number>(105)
  const quotesExist = Boolean(quote.amount !== 0)

  useEffect(() => {
    const contentEl = getRefValue(contentRef)?.scrollHeight
    setMaxHeight(contentEl)
  }, [])

  return (
    <Flex flexDirection="column">
      <CryptoCard
        padding="18px 18px"
        onClick={toggleAccordianVisibility}
        ref={contentRef}
        isClicked={active}
        elementHeight={maxHeight}
        isDisabled={!quotesExist}
      >
        <HeadingRow quote={quote} quotesExist={quotesExist} />

        <DropdownWrapper isClicked={!active}>
          {providerFeeTypes[quote.provider].map((feeType: FeeTypes) => {
            return <FeeItem key={feeType} feeTitle={feeType} quote={quote} />
          })}
          <ProviderCampaign provider={quote.provider} />
          <FiatOnRampModalButton
            provider={quote.provider}
            inputCurrency={quote.cryptoCurrency}
            outputCurrency={quote.fiatCurrency}
            amount={quote.amount.toString()}
            disabled={fetching}
            setModalView={setModalView}
          />
        </DropdownWrapper>
      </CryptoCard>
    </Flex>
  )
}

export default AccordionItem
