import { useSidNameForAddress } from 'hooks/useSid'
import { useUnsNameForAddress } from 'hooks/useUns'
import { useMemo } from 'react'

export const useDomainNameForAddress = (address: string, fetchData = true) => {
  const { sidName, isLoading: isSidLoading } = useSidNameForAddress(address, fetchData)
  const { unsName, isLoading: isUnsLoading } = useUnsNameForAddress(address, fetchData && !sidName && !isSidLoading)
  return useMemo(() => {
    return { domainName: sidName || unsName, isLoading: isSidLoading || (!sidName && isUnsLoading) }
  }, [sidName, unsName, isSidLoading, isUnsLoading])
}
