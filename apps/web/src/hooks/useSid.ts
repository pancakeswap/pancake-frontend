import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { namehash } from 'viem'
import { getSidResolverContract } from 'utils/contractHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { FetchStatus } from 'config/constants/types'
import { useSIDContract } from './useContract'

function getSidAddress(networkId) {
  if ([97].includes(networkId)) {
    return '0xfFB52185b56603e0fd71De9de4F6f902f05EEA23'
  }
  if ([1, 3, 4, 5].includes(networkId)) {
    return '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  }
  if ([56].includes(networkId)) {
    return '0x08CEd32a7f3eeC915Ba84415e9C07a7286977956'
  }
  if ([421613].includes(networkId)) {
    return '0x1f70fc8de5669eaa8C9ce72257c94500DC5ff2E4'
  }
  if ([42161].includes(networkId)) {
    return '0x4a067EE58e73ac5E4a43722E008DFdf65B2bF348'
  }
  return ''
}

export const useSidNameForAddress = (address: string, fetchData = true) => {
  const { chainId } = useActiveChainId()
  const sidContract = useSIDContract(getSidAddress(chainId), chainId)

  const { data: sidName, status } = useSWRImmutable(
    fetchData && address ? ['sidName', chainId, address.toLowerCase()] : null,
    async () => {
      const reverseNode = `${address.toLowerCase().slice(2)}.addr.reverse`
      const reverseNameHash = namehash(reverseNode)
      const resolverAddress = await sidContract.read.resolver([reverseNameHash])
      if (parseInt(resolverAddress, 16) === 0) {
        return {
          name: null,
        }
      }
      const resolverContract = getSidResolverContract(resolverAddress)
      const resolvedName = await resolverContract.read.name([reverseNameHash])
      return {
        name: resolvedName,
      }
    },
  )

  return useMemo(() => {
    return { sidName: sidName?.name, isLoading: status !== FetchStatus.Fetched }
  }, [sidName, status])
}
