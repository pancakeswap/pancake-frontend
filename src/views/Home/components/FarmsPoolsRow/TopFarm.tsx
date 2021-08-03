import React from 'react'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'

const TopFarm: React.FC<{ farm: FarmWithStakedValue }> = ({ farm }) => {
  return <div>{farm.lpSymbol}</div>
}

export default TopFarm
