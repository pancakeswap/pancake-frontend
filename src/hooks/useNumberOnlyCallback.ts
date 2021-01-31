import { useCallback } from 'react'

const NUMBER_ONLY_REGREX = /^\d+\.?\d{0,8}$/
const LEADING_ZEROS = /^0+(?=\d)/

export function useNumberOnlyCallback(onChange) {
  return useCallback(
    (e) => {
      let val = e.target.value
      // 1. number only validate
      if (!NUMBER_ONLY_REGREX.test(val) && val !== '') {
        e.stopPropagation()
        return
      }
      // 2. replace leading zero
      val = val.replace(LEADING_ZEROS, '')
      onChange(val)
    },
    [onChange],
  )
}

export default {}
