import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { bnToDec, decToBn } from '../utils'
import { getScalingFactor } from '../sushi/utils'

import useYam from './useYam'

const useScalingFactor = () => {
  const [scalingFactor, setScalingFactor] = useState(decToBn(1))
  const yam = useYam()

  useEffect(() => {
    async function fetchScalingFactor() {
      const sf = await getScalingFactor(yam)
      setScalingFactor(sf)
    }
    if (yam) {
      fetchScalingFactor()
    }
  }, [yam])

  return bnToDec(scalingFactor)
}

export default useScalingFactor
