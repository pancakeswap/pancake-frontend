import { useState, useCallback } from 'react'
import { Button } from '@pancakeswap/uikit'

import HideShowSelectorSection from './HideShowSelectorSection'
import { SELECTOR_TYPE } from '../types'

export function StableV3Selector({ handleFeePoolSelect }) {
  const [showOptions, setShowOptions] = useState(false)

  const onSelectorType = useCallback(() => {
    handleFeePoolSelect({
      type: SELECTOR_TYPE.STABLE,
    })
  }, [handleFeePoolSelect])

  return (
    <HideShowSelectorSection
      showOptions={showOptions}
      setShowOptions={setShowOptions}
      heading="heading"
      content={<Button onClick={onSelectorType}>Stable</Button>}
    />
  )
}
