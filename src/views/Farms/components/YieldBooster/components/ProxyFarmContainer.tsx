import { ReactElement, createContext } from 'react'
import { FarmWithStakedValue } from '../../types'
import useYieldBoosterState from '../hooks/useYieldBoosterState'

interface ProxyFarmContainerPropsType {
  children: ReactElement
  farm: FarmWithStakedValue
}

export const YieldBoosterStateContext = createContext(null)

const ProxyFarmContainer: React.FC<ProxyFarmContainerPropsType> = ({ children, farm }) => {
  const { state: boosterState, refreshActivePool } = useYieldBoosterState({
    farmPid: farm.pid,
  })

  return (
    <YieldBoosterStateContext.Provider value={{ boosterState, refreshActivePool }}>
      {children}
    </YieldBoosterStateContext.Provider>
  )
}

export default ProxyFarmContainer
