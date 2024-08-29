import { type Protocol } from '@pancakeswap/farms'
import { useMemo } from 'react'
import { getUniversalBCakeWrapperForPool } from 'state/farmsV4/state/poolApr/fetcher'
import { type Address, zeroAddress } from 'viem'

export const useBCakeWrapperAddress = ({
  lpAddress,
  chainId,
  protocol,
}: {
  lpAddress: Address
  chainId: number
  protocol?: Protocol
}) => {
  return useMemo(() => {
    const config = getUniversalBCakeWrapperForPool({ lpAddress, chainId, protocol })
    return config?.bCakeWrapperAddress ?? zeroAddress
  }, [lpAddress, chainId, protocol])
}
