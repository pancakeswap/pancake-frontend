import { useContext, useMemo } from 'react'
import { LocalContext } from './Provider'

export default function useSelector(selector) {
  const { localState } = useContext(LocalContext)

  const predState = useMemo(
    () => ({
      predictions: localState,
    }),
    [localState],
  )

  return selector(predState)
}
