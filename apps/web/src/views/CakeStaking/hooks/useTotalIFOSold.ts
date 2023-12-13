import { getTotalIFOSold } from '@pancakeswap/ifos'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useState } from 'react'

export const useTotalIFOSold = () => {
  const { chainId } = useActiveChainId()
  const [sold, setSold] = useState(0)

  useEffect(() => {
    // FIXME: gauges ifo should totally of mainnet
    getTotalIFOSold(chainId).then(setSold)
  }, [chainId])

  return sold
}
