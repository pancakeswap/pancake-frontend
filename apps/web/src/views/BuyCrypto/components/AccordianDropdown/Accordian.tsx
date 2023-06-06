import { useState } from 'react'
// import { AccordionData } from "../types";
import { FlexGap } from '@pancakeswap/uikit'
import AccordionItem from './AccordianItem'

function Accordion() {
  const [currentIdx, setCurrentIdx] = useState<number | string>(0)

  return (
    <FlexGap flexDirection="column" gap="16px">
      {[1, 2, 3].map((item, idx) => {
        return (
          <AccordionItem
            key={item}
            active={currentIdx === idx}
            btnOnClick={() => setCurrentIdx((a) => (a === idx ? '' : idx))}
          />
        )
      })}
    </FlexGap>
  )
}

export default Accordion
