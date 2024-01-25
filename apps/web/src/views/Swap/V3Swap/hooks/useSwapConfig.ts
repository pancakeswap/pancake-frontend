import { useExpertMode } from '@pancakeswap/utils/user'
import useTransactionDeadline from 'hooks/useTransactionDeadline'

export type SwapConfig = {
  isExpertMode: boolean
  deadline: bigint | undefined
}
export const useSwapConfig = (): SwapConfig => {
  const [isExpertMode] = useExpertMode()
  const deadline = useTransactionDeadline()

  return {
    isExpertMode,
    deadline,
  }
}
