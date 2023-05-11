import { useERC20 } from 'hooks/useContract'
import { Address } from 'wagmi'

export const requiresApproval = async (
  contract: ReturnType<typeof useERC20>,
  account: Address,
  spenderAddress: Address,
  minimumRequired: number | bigint = 0,
) => {
  try {
    const response = await contract.read.allowance([account, spenderAddress])
    const hasMinimumRequired = typeof minimumRequired !== 'undefined' && minimumRequired > 0
    if (hasMinimumRequired) {
      return response < minimumRequired
    }
    return response > 0
  } catch (error) {
    return true
  }
}
