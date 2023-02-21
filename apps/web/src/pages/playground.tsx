import { createFarmFetcherV3 } from '@pancakeswap/farms'
import { farmsV3 } from '@pancakeswap/farms/constants/97'
import { useEffect } from 'react'
import { multicallv2 } from 'utils/multicall'

const farmFetcherV3 = createFarmFetcherV3(multicallv2)

const Playground = () => {
  useEffect(() => {
    farmFetcherV3.fetchFarms({ chainId: 97, farms: farmsV3 })
  }, [])

  return null
}

export default Playground
