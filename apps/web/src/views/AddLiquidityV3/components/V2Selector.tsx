import { useState } from 'react'
import { SelectButton } from 'components/SelectButton'
import { EvenWidthAutoRow } from 'components/Layout/EvenWidthAutoRow'

import HideShowSelectorSection from './HideShowSelectorSection'
import { SELECTOR_TYPE } from '../types'

export function V2Selector({ isStable, handleFeePoolSelect, selectorType }) {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <HideShowSelectorSection
      showOptions={showOptions}
      setShowOptions={setShowOptions}
      heading={selectorType === SELECTOR_TYPE.STABLE ? 'Stable' : selectorType === SELECTOR_TYPE.V2 ? 'LP V2' : 'LP V3'}
      content={
        <EvenWidthAutoRow gap="1">
          {isStable ? (
            <>
              <SelectButton
                isActive={selectorType === SELECTOR_TYPE.STABLE}
                onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.STABLE })}
              >
                StableSwap LP
              </SelectButton>
            </>
          ) : (
            <>
              <SelectButton
                isActive={selectorType === SELECTOR_TYPE.V3}
                onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.V3 })}
              >
                V3 LP
              </SelectButton>
            </>
          )}
          <SelectButton
            isActive={selectorType === SELECTOR_TYPE.V2}
            onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.V2 })}
          >
            V2 LP
          </SelectButton>
        </EvenWidthAutoRow>
      }
    />
  )
}
