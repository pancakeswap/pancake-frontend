import { ReactElement, createContext } from 'react'
import { useFarmFromPid } from 'state/farms/hooks'
import { DeserializedFarm } from 'state/types'
import useYieldBoosterState, { YieldBoosterState } from '../hooks/useYieldBoosterState'

interface ProxyFarmContainerPropsType {
  children: (finalFarm: DeserializedFarm) => ReactElement
  farm: DeserializedFarm
}

export const YieldBoosterStateContext = createContext(null)

const ProxyFarmContainer: React.FC<ProxyFarmContainerPropsType> = ({ children, farm }) => {
  const { state: boosterState, refreshActivePool } = useYieldBoosterState({
    farmPid: farm.pid,
    proxyPid: farm.proxyPid,
  })

  // TODO: Add liquidity and apr in the farm. Reference to farmsList in Farms Component
  const proxyFarm = useFarmFromPid(farm.proxyPid)

  const shouldUseOriginalFarm = [YieldBoosterState.NO_MIGRATE, YieldBoosterState.UNCONNECTED].includes(boosterState)

  return (
    <YieldBoosterStateContext.Provider value={{ boosterState, refreshActivePool }}>
      {children(shouldUseOriginalFarm ? farm : proxyFarm)}
    </YieldBoosterStateContext.Provider>
  )
}

export default ProxyFarmContainer
