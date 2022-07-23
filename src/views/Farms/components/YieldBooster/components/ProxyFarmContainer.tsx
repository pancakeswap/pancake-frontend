import { ReactElement } from 'react'
import { useFarmFromPid } from 'state/farms/hooks'
import { DeserializedFarm } from 'state/types'
import useYieldBoosterState, { YieldBoosterState } from '../hooks/useYieldBoosterState'

interface ProxyFarmContainerPropsType {
  children: (finalFarm: DeserializedFarm) => ReactElement
  farm: DeserializedFarm
}

const ProxyFarmContainer: React.FC<ProxyFarmContainerPropsType> = ({ children, farm }) => {
  const boosterState = useYieldBoosterState({
    farmPid: farm.pid,
    proxyPid: farm.proxyPid,
  })

  const proxyFarm = useFarmFromPid(farm.proxyPid)

  const shouldUseOriginalFarm = [YieldBoosterState.NO_MIGRATE, YieldBoosterState.UNCONNECTED].includes(boosterState)

  return children(shouldUseOriginalFarm ? farm : proxyFarm)
}

export default ProxyFarmContainer
