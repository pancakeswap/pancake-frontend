import { useSingleCallResult } from '../state/multicall/hooks'
import { useMulticallContract } from './useContract'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): bigint | undefined {
  const multicall = useMulticallContract()
  return useSingleCallResult({
    contract: multicall,
    functionName: 'getCurrentBlockTimestamp',
  })?.result
}
