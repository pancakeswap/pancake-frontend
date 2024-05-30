import { useBlockTimestamp as useStateBlockTimestamp } from '@pancakeswap/wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'

export function useBlockTimestamp() {
  const { chainId } = useActiveChainId()
  const { data: timestamp } = useStateBlockTimestamp({
    chainId,
  })
  return timestamp
}

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): bigint | undefined {
  const timestamp = useBlockTimestamp()
  return timestamp ? BigInt(timestamp) : undefined
}
