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
      {[1, 2, 3].map((item, idx) => {
        return (
          <AccordionItem
            key={item}
            active={currentIdx === idx}
            btnOnClick={() => setCurrentIdx((a) => (a === idx ? '' : idx))}
            buyCryptoState={buyCryptoState}
            combinedQuotes={combinedQuotes}
          />
        )
      })}
    </FlexGap>
  )
}

export default Accordion
