import { useCallback, useEffect, useRef, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import useRefresh from './useRefresh'

const useStateWithPromise = (initialState) => {
  const [state, setState] = useState(initialState)
  const resolverRef = useRef(null)

  useEffect(() => {
    if (resolverRef.current) {
      resolverRef.current(state)
      resolverRef.current = null
    }
    /**
     * Since a state update could be triggered with the exact same state again,
     * it's not enough to specify state as the only dependency of this useEffect.
     * That's why resolverRef.current is also a dependency, because it will guarantee,
     * that handleSetState was called in previous render
     */
  }, [state])

  const handleSetState = useCallback(
    (stateAction) => {
      setState(stateAction)
      return new Promise((resolve) => {
        resolverRef.current = resolve
      })
    },
    [setState],
  )

  return [state, handleSetState]
}

export default useStateWithPromise
