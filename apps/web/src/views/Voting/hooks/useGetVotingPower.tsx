import { ChainId } from '@pancakeswap/sdk'
import { useAccount, Address } from 'wagmi'
import { FetchStatus } from 'config/constants/types'
import useSWRImmutable from 'swr/immutable'
import { getActivePools } from 'utils/calls'
import { bscTokens } from '@pancakeswap/tokens'
import { publicClient } from 'utils/wagmi'
import { getVotingPower } from '../helpers'

interface State {
  cakeBalance?: number
  cakeVaultBalance?: number
  cakePoolBalance?: number
  poolsBalance?: number
  cakeBnbLpBalance?: number
  ifoPoolBalance?: number
  total: number
  lockedCakeBalance?: number
  lockedEndTime?: number
}

const useGetVotingPower = (block?: number): State & { isLoading: boolean; isError: boolean } => {
  const { address: account } = useAccount()
  const { data, status, error } = useSWRImmutable(account ? [account, block, 'votingPower'] : null, async () => {
    const blockNumber = block ? BigInt(block) : await publicClient({ chainId: ChainId.BSC }).getBlockNumber()
    const eligiblePools = await getActivePools(ChainId.BSC, Number(blockNumber))
    const poolAddresses: Address[] = eligiblePools
      .filter((pair) => pair.stakingToken.address.toLowerCase() === bscTokens.cake.address.toLowerCase())
      .map(({ contractAddress }) => contractAddress)

    const {
      cakeBalance,
      cakeBnbLpBalance,
      cakePoolBalance,
      total,
      poolsBalance,
      cakeVaultBalance,
      ifoPoolBalance,
      lockedCakeBalance,
      lockedEndTime,
    } = await getVotingPower(account, poolAddresses, blockNumber)
    return {
      cakeBalance,
      cakeBnbLpBalance,
      cakePoolBalance,
      poolsBalance,
      cakeVaultBalance,
      ifoPoolBalance,
      total,
      lockedCakeBalance,
      lockedEndTime,
    }
  })
  if (error) console.error(error)

  return { ...data, isLoading: status !== FetchStatus.Fetched, isError: status === FetchStatus.Failed }
}

export default useGetVotingPower
