import BigNumber from 'bignumber.js'
import { getCakeContract } from 'utils/contractHelpers'
import { useAccount, useContractRead } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export const useCakeApprovalStatus = (spender) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, refetch } = useContractRead({
    chainId,
    ...getCakeContract(chainId),
    enabled: Boolean(account && spender),
    functionName: 'allowance',
    args: [account, spender],
    watch: true,
  })

  return {
    isVaultApproved: data > 0,
    allowance: new BigNumber(data?.toString()),
    setLastUpdated: refetch,
  }
}

export default useCakeApprovalStatus
