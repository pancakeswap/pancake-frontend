import { Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { CryptoCard } from 'components/Card'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { getRefValue } from 'views/BuyCrypto/hooks/useGetRefValue'
import { ProviderQoute } from 'views/BuyCrypto/hooks/usePriceQuoter'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import MoonPayLogo from '../../../../../public/images/onRampProviders/moonpaySvg.svg'
import BinanceConnectLogo from '../../../../../public/images/onRampProviders/binanceConnectSvg.svg'
import MercuryoLogo from '../../../../../public/images/onRampProviders/mercuryoLogo.svg'

const ProviderToLogo: { [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>> } = {
  MoonPay: MoonPayLogo,
  Mercuryo: MercuryoLogo,
  BinanceConnect: BinanceConnectLogo,
}

interface Props {
  provider: string
}

const UnknownEntry = styled.div`
  height: 24px;
  width: 24px;
  background: #dee0e3;
  border-radius: 50%;
`

export const ProviderIcon: React.FC<
  Props &
    (React.SVGProps<SVGSVGElement> &
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ provider, className, ...props }) => {
  const Icon = ProviderToLogo[provider]
  return <>{Icon ? <Icon className={className} {...props} /> : <UnknownEntry />}</>
}

const calculateMoonPayQuoteFromFees = (quote: ProviderQoute, spendAmount: string) => {
  const totalFees = new BigNumber(quote.networkFee).plus(new BigNumber(quote.providerFee))
  const fiatAmountAfterFees = new BigNumber(spendAmount).minus(totalFees)
  const AssetRate = new BigNumber(quote.quote)
  const moonPayQuote = fiatAmountAfterFees.dividedBy(AssetRate)
  return moonPayQuote.toNumber()
}

const calculateBinanceConnectQuoteFromFees = (quote: ProviderQoute) => {
  const binanceConnectQuote = new BigNumber(quote.amount).minus(new BigNumber(quote.networkFee).shiftedBy(2))
  return binanceConnectQuote.toNumber()
}

// const calculateMercuryoQuoteFromFees = (quote: ProviderQoute, spendAmount: string) => {
//   const totalFees = new BigNumber(quote.networkFee).plus(new BigNumber(quote.providerFee))
//   const fiatAmountAfterFees = new BigNumber(spendAmount).minus(totalFees)
//   const AssetRate = new BigNumber(quote.quote)
//   const moonPayQuote = fiatAmountAfterFees.dividedBy(AssetRate)
//   return moonPayQuote.toString()
// }

function AccordionItem({
  active,
  btnOnClick,
  buyCryptoState,
  quote,
}: {
  active: boolean
  btnOnClick: any
  buyCryptoState: BuyCryptoState
  quote: ProviderQoute
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(105)
  const multiple = false
  const [visiblity, setVisiblity] = useState(false)

  const isActive = () => (multiple ? visiblity : active)

  const toogleVisiblity = useCallback(() => {
    setVisiblity((v) => !v)
    btnOnClick()
  }, [setVisiblity, btnOnClick])

  useEffect(() => {
    if (active) {
      const contentEl = getRefValue(contentRef)
      setHeight(contentEl.scrollHeight + 105)
    } else setHeight(105)
  }, [active])

  let finalQuote = quote.amount
  if (quote.provider === 'MoonPay') finalQuote = calculateMoonPayQuoteFromFees(quote, buyCryptoState.typedValue)
  else if (quote.provider === 'BinanceConnect') finalQuote = calculateBinanceConnectQuoteFromFees(quote)

  return (
    <Flex flexDirection="column">
      <CryptoCard
        padding="12px 12px"
        style={{ height }}
        onClick={!isActive() ? toogleVisiblity : () => null}
        position="relative"
        isClicked={active}
      >
        <RowBetween paddingBottom="20px">
          <ProviderIcon provider={quote.provider} width="130px" />
          <Flex>
            <Text ml="4px" fontSize="22px" color="secondary">
              {finalQuote.toFixed(4)} {buyCryptoState.INPUT.currencyId}
            </Text>
          </Flex>
        </RowBetween>
        <RowBetween pt="8px">
          <Text fontSize="15px">{buyCryptoState.INPUT.currencyId} rate</Text>
          <Text ml="4px" fontSize="16px">
            = {quote.quote?.toFixed(4)} {buyCryptoState.OUTPUT.currencyId}
          </Text>
        </RowBetween>

        <div ref={contentRef} className="accordion-item-content" style={{ height }}>
          <RowBetween>
            <Text fontSize="14px" color="textSubtle">
              Total Fees
            </Text>
            <Text ml="4px" fontSize="14px" color="textSubtle">
              {(quote.networkFee + quote.providerFee).toFixed(2)}
            </Text>
          </RowBetween>
          <RowBetween>
            <Text fontSize="14px" pl="8px" color="textSubtle">
              Networking Fees
            </Text>
            <Text ml="4px" fontSize="14px" color="textSubtle">
              {quote.networkFee.toFixed(3)}
            </Text>
          </RowBetween>
          <RowBetween>
            <Text fontSize="14px" pl="8px" color="textSubtle">
              Processing Fees
            </Text>
            <Text ml="4px" fontSize="14px" color="textSubtle">
              {quote.providerFee.toFixed(3)}
            </Text>
          </RowBetween>
          <FiatOnRampModalButton
            provider={quote.provider}
            inputCurrency={buyCryptoState.INPUT.currencyId}
            outputCurrency={buyCryptoState.OUTPUT.currencyId}
            amount={buyCryptoState.typedValue}
          />
        </div>
      </CryptoCard>
    </Flex>
  )
}

export default AccordionItem
