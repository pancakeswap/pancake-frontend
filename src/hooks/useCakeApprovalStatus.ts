import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useCake } from 'hooks/useContract'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'

// TODO: refactor as useTokenApprovalStatus for generic use

export const useCakeApprovalStatus = (spender) => {
  const { account } = useWeb3React()
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
