import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { polygonRpcProvider } from 'utils/providers'
import { Address } from 'viem'
import { useUNSContract } from './useContract'

function getUnsAddress(networkId) {
  if ([1].includes(networkId)) {
    return '0x049aba7510f45BA5b64ea9E658E342F904DB358D'
  }
  if ([137].includes(networkId)) {
    return '0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f'
  }
  return ''
}

export const useUnsNameForAddress = (address: Address, fetchData = true) => {
  const unsEtherContract = useUNSContract(getUnsAddress(1), ChainId.ETHEREUM, undefined)
  const unsPolygonContract = useUNSContract(getUnsAddress(137), undefined, polygonRpcProvider)

  const { data: unsName, status } = useQuery({
    queryKey: ['unsName', address?.toLowerCase()],

    queryFn: async () => {
      const etherDomainName = await unsEtherContract.read.reverseNameOf([address])
      if (!etherDomainName) {
        const polyDomainName = await unsPolygonContract.read.reverseNameOf([address])
        if (!polyDomainName) {
          return {
            name: null,
          }
        }
        return {
          name: polyDomainName,
        }
      }
      return {
        name: etherDomainName,
      }
    },

    enabled: Boolean(fetchData && address),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return useMemo(() => {
    return { unsName: unsName?.name, isLoading: status !== 'success' }
  }, [unsName, status])
}
