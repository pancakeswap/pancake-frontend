import { useCurrentBlockTimestamp as useBlockTimestamp } from 'state/block/hooks'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): bigint | undefined {
  const timestamp = useBlockTimestamp()
  return timestamp ? BigInt(timestamp) : undefined
}
