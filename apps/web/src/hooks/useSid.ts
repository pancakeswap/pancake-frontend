import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { ChainId } from '@pancakeswap/sdk'
import SID, { getSidAddress } from '@siddomains/sidjs'
import { FetchStatus } from '../config/constants/types'
import useActiveWeb3React from './useActiveWeb3React'
import { bscRpcProvider } from '../utils/providers'

export const useSidNameForAddress = (address: string, fetchData = true) => {
  const { chainId } = useActiveWeb3React()

  const { data: sidName, status } = useSWRImmutable(
    fetchData && address && [ChainId.BSC, ChainId.BSC_TESTNET].includes(chainId)
      ? ['sidName', chainId, address.toLowerCase()]
      : null,
    async () => {
      const sid = new SID({ provider: bscRpcProvider, sidAddress: getSidAddress(`${chainId}`) })
      return sid.getName(address.toLowerCase())
    },
  )

  return useMemo(() => {
    return { sidName: sidName?.name, isLoading: status !== FetchStatus.Fetched }
  }, [sidName, status])
}

export const useSidAddressForName = (name: string, fetchData: boolean) => {
  const { chainId } = useActiveWeb3React()

  const { data: sidAddress, status } = useSWRImmutable(
    fetchData && name && [ChainId.BSC, ChainId.BSC_TESTNET].includes(chainId) ? ['sidAddress', chainId, name] : null,
    async () => {
      const sid = new SID({ bscRpcProvider, sidAddress: getSidAddress(`${chainId}`) })
      const address = await sid.name(name).getAddress()
      if (parseInt(address, 16) === 0) {
        return '-'
      }
      return address
    },
  )

  return useMemo(() => {
    return { sidAddress: sidAddress === '-' ? null : sidAddress, isLoading: status !== FetchStatus.Fetched }
  }, [sidAddress, status])
}
