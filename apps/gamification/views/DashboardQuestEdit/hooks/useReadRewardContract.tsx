import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { SUPPORTED_CHAIN } from 'config/supportedChain'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getQuestRewardContract } from 'utils/contractHelpers'
import { Address, encodePacked, keccak256, toHex } from 'viem'

interface UseReadRewardContractProps {
  id: string
  ownerAddress: string
}

interface SingleDataHaveAmount {
  chain: ChainId
  result: [Address, number, number, number, Address, Address, bigint, bigint]
}

interface DataHaveAmount {
  data: SingleDataHaveAmount[]
  refetch: () => void
}

export const useReadRewardContract = ({ id, ownerAddress }: UseReadRewardContractProps): DataHaveAmount => {
  const { account } = useActiveWeb3React()

  const { data, refetch } = useQuery({
    queryKey: ['fetch-admin-quest-reward', id, ownerAddress],
    queryFn: async (): Promise<SingleDataHaveAmount[]> => {
      try {
        const _id = keccak256(encodePacked(['bytes32', 'address'], [toHex(id), ownerAddress as Address]))

        const allChainContract = await Promise.allSettled(
          SUPPORTED_CHAIN.map(async (chain) => {
            try {
              const result = await getQuestRewardContract(chain).read.quests([_id]) // [root, claimTime, totalWinners, totalClaimedWinners, organizer, rewardToken, totalReward, totalClaimedReward]
              return { chain, result }
            } catch (err: any) {
              // Handle specific contract function execution error
              if (err.message.includes('ContractFunctionExecutionError')) {
                console.error(`Error calling "quests" function on chain ${chain}:`, err.message)
                return { chain, error: err.message }
              }
              throw err // Re-throw other errors
            }
          }),
        )

        // Separate fulfilled and rejected promises
        const fulfilled = allChainContract.filter((promise) => promise.status === 'fulfilled')
        const findDataHaveAmount = fulfilled
          .map((validData: any) => {
            if (Number(validData?.value?.result?.[6]) > 0) {
              // totalReward
              return validData.value
            }
            return false
          })
          .filter((i) => Boolean(i))

        return findDataHaveAmount.length > 0 ? (findDataHaveAmount as SingleDataHaveAmount[]) : []
      } catch {
        return [] as SingleDataHaveAmount[]
      }
    },
    enabled: Boolean(account && id && ownerAddress),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    data: data ?? [],
    refetch,
  }
}
