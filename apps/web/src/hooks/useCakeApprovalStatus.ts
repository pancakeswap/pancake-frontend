import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useCake } from 'hooks/useContract'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'

// TODO: refactor as useTokenApprovalStatus for generic use

export const useCakeApprovalStatus = (spender) => {
  const { address: account } = useAccount()
  const { reader: cakeContract } = useCake()

  const key = useMemo<UseSWRContractKey>(
    () =>
      account && spender
        ? {
            contract: cakeContract,
            methodName: 'allowance',
            params: [account, spender],
          }
        : null,
    [account, cakeContract, spender],
  )

  const { data, mutate } = useSWRContract(key)

  return { isVaultApproved: data ? data.gt(0) : false, setLastUpdated: mutate }
}

export default useCakeApprovalStatus
