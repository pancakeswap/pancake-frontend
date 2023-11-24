import { useState } from 'react'

const useABTestResult = <T extends number>(
  userDeterministicResult: number,
  probabilityThreshold: T,
): {
  isUserResultBelowThreshold: boolean
} => {
  const isNumberInRange = (num: number): num is T => num > 0 && num <= 1

  if (!isNumberInRange(probabilityThreshold as unknown as number)) {
    throw new Error('Probability threshold must be a number between 0 and 1')
  }

  const [isUserResultBelowThreshold] = useState<boolean>(Number(probabilityThreshold) > userDeterministicResult)

  return { isUserResultBelowThreshold }
}

export default useABTestResult
