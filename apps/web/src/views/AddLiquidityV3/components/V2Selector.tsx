import { useState } from 'react'
import { Button } from '@pancakeswap/uikit'

import HideShowSelectorSection from './HideShowSelectorSection'
import { SELECTOR_TYPE } from '../types'

export function V2Selector({ handleFeePoolSelect, selectorType }) {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <HideShowSelectorSection
      showOptions={showOptions}
      setShowOptions={setShowOptions}
      heading={selectorType === SELECTOR_TYPE.STABLE ? 'Stable' : selectorType === SELECTOR_TYPE.V2 ? 'LP V2' : 'LP V3'}
      content={
        <>
          {selectorType === SELECTOR_TYPE.STABLE ? (
            <>
              <Button onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.STABLE })}>Stable</Button>
            </>
          ) : (
            <>
              <Button onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.V3 })}>LP 3</Button>
            </>
          )}
          <Button onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.V2 })}>LP 2</Button>
        </>
      }
    />
  )
}
