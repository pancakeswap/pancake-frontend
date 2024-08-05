import { useERC20 } from 'hooks/useContract'
import { Address } from 'viem'

export const requiresApproval = async (
  contract: ReturnType<typeof useERC20>,
  account: Address,
  spenderAddress: Address,
  minimumRequired = 0n,
) => {
  try {
    if (!contract) return true

    const response = await contract.read.allowance([account, spenderAddress])
    const hasMinimumRequired = typeof minimumRequired !== 'undefined' && minimumRequired > 0n
    if (hasMinimumRequired) {
      return response < minimumRequired
    }
    return response <= 0
  } catch (error) {
    return true
  }
}
