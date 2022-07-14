import { useFarmFromPid } from 'state/farms/hooks'
import useYieldBoosterState, { YieldBoosterState } from '../hooks/useYieldBoosterState'

const ProxyFarmContainer = ({ children, ...farm }) => {
  const boosterState = useYieldBoosterState({
    farmPid: farm.pid,
    proxyPid: farm.proxyPid,
  })

  const proxyFarm = useFarmFromPid(farm.proxyPid)

  const shouldUseOriginalFarm = [YieldBoosterState.NO_MIGRATE, YieldBoosterState.UNCONNECTED].includes(boosterState)

  return children(shouldUseOriginalFarm ? farm : proxyFarm)
}

export default ProxyFarmContainer
