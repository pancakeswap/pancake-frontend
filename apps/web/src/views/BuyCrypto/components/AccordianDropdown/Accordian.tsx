import { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, FlexGap, Row, Text } from '@pancakeswap/uikit'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { ProviderQoute } from 'views/BuyCrypto/hooks/usePriceQuoter'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import AccordionItem from './AccordianItem'

function Accordion({
  buyCryptoState,
  combinedQuotes,
  fetching,
}: {
  buyCryptoState: BuyCryptoState
  combinedQuotes: ProviderQoute[]
  fetching: boolean
}) {
  const { t } = useTranslation()
  const [currentIdx, setCurrentIdx] = useState<number | string>(0)
  const [sortedArray, setSortedArray] = useState([])

  const MoonapyAmt = useCallback(
    (quote: ProviderQoute) => {
      const totalFees = new BigNumber(quote.networkFee).plus(new BigNumber(quote.providerFee))
      const fiatAmountAfterFees = new BigNumber(buyCryptoState.typedValue).minus(totalFees)
      const AssetRate = new BigNumber(quote.quote)
      const moonPayQuote = fiatAmountAfterFees.dividedBy(AssetRate).toNumber()
      return moonPayQuote
    },
    [buyCryptoState.typedValue],
  )

  const MercuryAmt = (quote: ProviderQoute) => {
    const binanceConnectQuote = new BigNumber(quote.amount).minus(new BigNumber(quote.networkFee))
    return binanceConnectQuote.toNumber()
  }

  const sortQuotes = useCallback(() => {
    const arr = []
    combinedQuotes.forEach((quote) => {
      if (quote.provider === 'MoonPay') {
        const mp = {
          providerFee: quote.providerFee,
          networkFee: quote.networkFee,
          amount: MoonapyAmt(quote),
          quote: quote.quote,
          provider: quote.provider,
        }
        arr.push(mp)
      }
      if (quote.provider === 'Mercuryo') {
        const mmp = {
          providerFee: quote.providerFee,
          networkFee: quote.networkFee,
          amount: MercuryAmt(quote),
          quote: quote.quote,
          provider: quote.provider,
        }
        arr.push(mmp)
      }
    })
    arr.sort((a, b) => {
      const totalAmountA = a.amount
      const totalAmountB = b.amount
      if (a.amount === 0 && b.amount === 0) return 0
      if (a.amount === 0) return 1
      if (b.amount === 0) return -1

      return totalAmountB - totalAmountA // Note the difference here for descending order
    })
    setSortedArray(arr)
  }, [MoonapyAmt, combinedQuotes])

  useEffect(() => {
    sortQuotes()
  }, [sortQuotes])

  const areValidQuotes = useMemo(() => {
    let res = true
    combinedQuotes.forEach((quote) => {
      if (Number(quote.amount) > 0) res = false
    })
    return res
  }, [combinedQuotes])

  if (areValidQuotes) {
    return (
      <FlexGap flexDirection="column" gap="16px">
        <Row paddingBottom="20px" justifyContent="center">
          <Flex>
            <Text ml="4px" fontSize="16px" textAlign="center">
              {t('No quote for this token pair at the moment.')}
            </Text>
          </Flex>
        </Row>
      </FlexGap>
    )
  }
  return (
    <FlexGap flexDirection="column" gap="16px">
      {sortedArray.length > 0 &&
        sortedArray.map((quote: ProviderQoute, idx) => {
          return (
            <AccordionItem
              key={quote.provider}
              active={currentIdx === idx}
              btnOnClick={() => setCurrentIdx((a) => (a === idx ? '' : idx))}
              buyCryptoState={buyCryptoState}
              quote={quote}
              fetching={fetching}
            />
          )
        })}
    </FlexGap>
  )
}

export default Accordion
