import { ReactElement, createContext, useMemo, memo } from 'react'
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

const ProxyFarmContainer: React.FC<ProxyFarmContainerPropsType> = ({ children, farm }) => {
  const {
    state: boosterState,
    refreshActivePool,
    shouldUseProxyFarm,
  } = useYieldBoosterState({
    farmPid: farm.pid,
  })

  const proxyFarm = useMemo(
    () => ({
      ...farm,
      userData: farm.userData.proxy,
    }),
    [farm],
  )

  return (
    <YieldBoosterStateContext.Provider value={{ boosterState, refreshActivePool, proxyFarm, shouldUseProxyFarm }}>
      {children}
    </YieldBoosterStateContext.Provider>
  )
}

export default memo(ProxyFarmContainer)
