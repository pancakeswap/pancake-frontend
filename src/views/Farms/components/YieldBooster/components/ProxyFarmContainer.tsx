import { ReactElement, createContext } from 'react'
import { useFarmFromPid, useFarmWithStakeValue } from 'state/farms/hooks'
import { FarmWithStakedValue } from '../../types'
import useYieldBoosterState, { YieldBoosterState } from '../hooks/useYieldBoosterState'

interface ProxyFarmContainerPropsType {
  children: (finalFarm: FarmWithStakedValue) => ReactElement
  farm: FarmWithStakedValue
}

export const YieldBoosterStateContext = createContext(null)

const ProxyFarmContainer: React.FC<ProxyFarmContainerPropsType> = ({ children, farm }) => {
  const { state: boosterState, refreshActivePool } = useYieldBoosterState({
    farmPid: farm.pid,
    proxyPid: farm.proxyPid,
  })

  const proxyFarm = useFarmFromPid(farm.proxyPid)
  const proxyFarmWithStakeValue = useFarmWithStakeValue(proxyFarm)

  const shouldUseOriginalFarm = [YieldBoosterState.NO_MIGRATE, YieldBoosterState.UNCONNECTED].includes(boosterState)

  return (
    <YieldBoosterStateContext.Provider value={{ boosterState, refreshActivePool }}>
      {children(shouldUseOriginalFarm ? farm : proxyFarmWithStakeValue)}
    </YieldBoosterStateContext.Provider>
  )
}

export default ProxyFarmContainer
