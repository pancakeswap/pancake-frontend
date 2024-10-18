import { useQuery } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeCakeContract } from 'hooks/useContract'
import { Address, zeroAddress } from 'viem'
import { useVeCakeUserInfo } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { safeGetAddress } from 'utils'
import { useNextEpochStart } from './useEpochTime'

export const useEpochVotePower = () => {
  const nextEpoch = useNextEpochStart()
  const contract = useVeCakeContract()
  const { account } = useAccountActiveChain()
  const { data: userInfo } = useVeCakeUserInfo()

  const { data, isLoading } = useQuery({
    queryKey: ['epochVotePower', nextEpoch, contract.address, contract.chain?.id],

    queryFn: async () => {
      if (!contract || !nextEpoch) return 0n
      const votePower = await contract.read.balanceOfAtTime([account!, BigInt(nextEpoch)])
      const proxyVotePower =
        !userInfo?.cakePoolProxy ||
        userInfo?.cakePoolProxy === '0x' ||
        safeGetAddress(userInfo?.cakePoolProxy) === zeroAddress
          ? 0n
          : await contract.read.balanceOfAtTime([userInfo?.cakePoolProxy as Address, BigInt(nextEpoch)])
      // const proxyVotePower = await contract.read.balanceOfAtForProxy([account!, BigInt(nextEpoch)])
      return votePower + proxyVotePower
    },

    enabled: !!nextEpoch && !!contract.address && !!account,
  })

  return { data: data ?? 0n, isLoading }
}
