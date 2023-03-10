import { createContext } from 'react'
import type { V2StakeValueAndV3Farms } from './FarmsV3'

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export const FarmsV3Context = createContext<{ chosenFarmsMemoized: V2StakeValueAndV3Farms }>({
  chosenFarmsMemoized: [],
})
