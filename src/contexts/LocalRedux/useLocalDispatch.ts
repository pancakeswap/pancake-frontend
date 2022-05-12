import { useContext, useCallback } from 'react'
import _noop from 'lodash/noop'
import { LocalContext } from './Provider'

export default function useLocalDispatch() {
  const localContext = useContext(LocalContext)

  const emptyFn = useCallback(_noop, [])

  return localContext?.store?.dispatch || emptyFn
}
