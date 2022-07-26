import { ReactElement, createContext, useMemo } from 'react'
import _noop from 'lodash/noop'

import { FarmWithStakedValue } from '../../types'
import useYieldBoosterState, { YieldBoosterState } from '../hooks/useYieldBoosterState'

interface ProxyFarmContainerPropsType {
  children: ReactElement
  farm: FarmWithStakedValue
}

export const YieldBoosterStateContext = createContext({
  boosterState: YieldBoosterState.UNCONNECTED,
  refreshActivePool: _noop,
  proxyFarm: {},
  shouldUseProxyFarm: false,
})

function useProxyFarm(farm) {
  const proxyFarm = useMemo(
    () => ({
      ...farm,
      // FIX: Why userData is undefined
      userData: farm.userData.proxy,
    }),
    [farm],
  )

  return proxyFarm
}

const ProxyFarmContainer: React.FC<ProxyFarmContainerPropsType> = ({ children, farm }) => {
  const {
    state: boosterState,
    refreshActivePool,
    shouldUseProxyFarm,
  } = useYieldBoosterState({
    farmPid: farm.pid,
  })

  const proxyFarm = useProxyFarm(farm)

  return (
    <YieldBoosterStateContext.Provider value={{ boosterState, refreshActivePool, proxyFarm, shouldUseProxyFarm }}>
      {children}
    </YieldBoosterStateContext.Provider>
  )
}

export default ProxyFarmContainer
