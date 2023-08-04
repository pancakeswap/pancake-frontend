import BigNumber from 'bignumber.js'
import { Address, erc20ABI, useAccount, useContractRead } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'

interface UseLiquidStakingApprovalProps {
  tokenAddress: string
  contractAddress: Address
}

export const useLiquidStakingApprovalStatus = ({ tokenAddress, contractAddress }: UseLiquidStakingApprovalProps) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, refetch } = useContractRead({
    chainId,
    abi: erc20ABI,
    address: tokenAddress as Address,
    functionName: 'allowance',
    args: [account, contractAddress],
    enabled: !!account && !!contractAddress,
  })

  return {
    isApproved: data ? data > 0 : false,
    allowance: new BigNumber(data?.toString()),
    setLastUpdated: refetch,
  }
}

export default useLiquidStakingApprovalStatus
