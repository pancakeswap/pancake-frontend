import { useState } from 'react'
// import { AccordionData } from "../types";
import { FlexGap } from '@pancakeswap/uikit'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { ProviderQoute } from 'views/BuyCrypto/hooks/usePriceQuoter'
import AccordionItem from './AccordianItem'

function Accordion({
  buyCryptoState,
  combinedQuotes,
}: {
  buyCryptoState: BuyCryptoState
  combinedQuotes: ProviderQoute[]
}) {
  const [currentIdx, setCurrentIdx] = useState<number | string>(0)

  return (
    <FlexGap flexDirection="column" gap="16px">
      {combinedQuotes.map((quote: ProviderQoute, idx) => {
        return (
          <AccordionItem
            key={quote.baseCurrency}
            active={currentIdx === idx}
            btnOnClick={() => setCurrentIdx((a) => (a === idx ? '' : idx))}
            buyCryptoState={buyCryptoState}
            quote={quote}
          />
        )
      })}
    </FlexGap>
  )
}

export default Accordion
