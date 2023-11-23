import { useQuery } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeCakeContract } from 'hooks/useContract'
import { useCurrentEpochEnd } from './useEpochTime'

export const useEpochVotePower = () => {
  const epochEnd = useCurrentEpochEnd()
  const contract = useVeCakeContract()
  const { account } = useAccountActiveChain()

  const { data } = useQuery(
    ['epochVotePower', epochEnd, contract.address, contract.chain?.id],
    async () => {
      if (!contract || !epochEnd) return 0n
      const votePower = await contract.read.balanceOfAtTime([account!, BigInt(epochEnd)])
      return votePower
    },
    {
      enabled: !!epochEnd && !!contract.address && !!account,
    },
  )

  return data ?? 0n
}
