import { useQuery } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeCakeContract } from 'hooks/useContract'
import { useNextEpochStart } from './useEpochTime'

export const useEpochVotePower = () => {
  const nextEpoch = useNextEpochStart()
  const contract = useVeCakeContract()
  const { account } = useAccountActiveChain()

  const { data } = useQuery(
    ['epochVotePower', nextEpoch, contract.address, contract.chain?.id],
    async () => {
      if (!contract || !nextEpoch) return 0n
      const votePower = await contract.read.balanceOfAtTime([account!, BigInt(nextEpoch)])
      return votePower
    },
    {
      enabled: !!nextEpoch && !!contract.address && !!account,
    },
  )

  return data ?? 0n
}
