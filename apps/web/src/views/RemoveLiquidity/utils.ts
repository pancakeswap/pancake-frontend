import { Hash, ContractFunctionExecutionError } from 'viem'

export const checkSlippageError = (error: any): boolean => {
  if (error instanceof ContractFunctionExecutionError) {
    const errorMessage = error.message || ''

    if (
      errorMessage.includes('ds-math-sub-underflow') ||
      errorMessage.includes('PancakeRouter: INSUFFICIENT_A_AMOUNT')
    ) {
      return true
    }
  }
  return false
}
