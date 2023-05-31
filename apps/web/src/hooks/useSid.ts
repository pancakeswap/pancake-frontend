import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import SID, { getSidAddress } from '@siddomains/sidjs'
import { bscRpcProvider } from 'utils/providers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { FetchStatus } from 'config/constants/types'

export const useSidNameForAddress = (address: string, fetchData = true) => {
  const { chainId } = useActiveChainId()

  const { data: sidName, status } = useSWRImmutable(
    fetchData && address ? ['sidName', chainId, address.toLowerCase()] : null,
    async () => new SID({ provider: bscRpcProvider, sidAddress: getSidAddress(chainId) }).getName(address),
  )

  return useMemo(() => {
    return { sidName: sidName?.name, isLoading: status !== FetchStatus.Fetched }
  }, [sidName, status])
}
