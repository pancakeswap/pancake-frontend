import { useState } from 'react'
import { Button } from '@pancakeswap/uikit'

import HideShowSelectorSection from './HideShowSelectorSection'
import { SELECTOR_TYPE } from '../types'

export function StableV3Selector({ handleFeePoolSelect, selectorType }) {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <HideShowSelectorSection
      showOptions={showOptions}
      setShowOptions={setShowOptions}
      heading={selectorType === SELECTOR_TYPE.STABLE ? 'Stable' : 'LP V3'}
      content={
        <>
          <Button onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.STABLE })}>Stable</Button>
          <Button onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.V3 })}>LP 3</Button>
        </>
      }
    />
  )
}
