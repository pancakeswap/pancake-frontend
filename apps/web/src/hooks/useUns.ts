import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { FetchStatus } from 'config/constants/types'
import { polygonRpcProvider } from 'utils/providers'
import { ChainId } from '@pancakeswap/sdk'
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

export const useUnsNameForAddress = (address: string, fetchData = true) => {
  const unsEtherContract = useUNSContract(getUnsAddress(1), ChainId.ETHEREUM, undefined)
  const unsPolygonContract = useUNSContract(getUnsAddress(137), undefined, polygonRpcProvider)

  const { data: unsName, status } = useSWRImmutable(
    fetchData && address ? ['unsName', address.toLowerCase()] : null,
    async () => {
      const etherTokenId = await unsEtherContract.reverseOf(address)
      if (etherTokenId.eq(0)) {
        const polyTokenId = await unsPolygonContract.reverseOf(address)
        if (polyTokenId.eq(0)) {
          return {
            name: null,
          }
        }
        const tokenURI = await unsPolygonContract.tokenURI(polyTokenId.toString())
        const response = await (await fetch(tokenURI)).json()
        return {
          name: response.name,
        }
      }
      const tokenURI = await unsEtherContract.tokenURI(etherTokenId.toString())
      const response = await (await fetch(tokenURI)).json()
      return {
        name: response.name,
      }
    },
  )

  return useMemo(() => {
    return { unsName: unsName?.name, isLoading: status !== FetchStatus.Fetched }
  }, [unsName, status])
}
