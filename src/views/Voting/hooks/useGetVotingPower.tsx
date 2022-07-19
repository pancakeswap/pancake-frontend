import { useWeb3React } from '@web3-react/core'
import { FetchStatus } from 'config/constants/types'
import useSWRImmutable from 'swr/immutable'
import { getAddress } from 'utils/addressHelpers'
import { getActivePools } from 'utils/calls'
import { bscRpcProvider } from 'utils/providers'
import { getVotingPower } from '../helpers'

interface State {
  cakeBalance?: number
  cakeVaultBalance?: number
  cakePoolBalance?: number
  poolsBalance?: number
  cakeBnbLpBalance?: number
  ifoPoolBalance?: number
  total: number
}

const useGetVotingPower = (block?: number, isActive = true): State & { isLoading: boolean; isError: boolean } => {
  const { account } = useWeb3React()
  const { data, status, error } = useSWRImmutable(
    account && isActive ? [account, block, 'votingPower'] : null,
    async () => {
      const blockNumber = block || (await bscRpcProvider.getBlockNumber())
      const eligiblePools = await getActivePools(blockNumber)
      const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress, 56))
      const { cakeBalance, cakeBnbLpBalance, cakePoolBalance, total, poolsBalance, cakeVaultBalance, ifoPoolBalance } =
        await getVotingPower(account, poolAddresses, blockNumber)
      return {
        cakeBalance,
        cakeBnbLpBalance,
        cakePoolBalance,
        poolsBalance,
        cakeVaultBalance,
        ifoPoolBalance,
        total,
      }
    },
  )
  if (error) console.error(error)

  return { ...data, isLoading: status !== FetchStatus.Fetched, isError: status === FetchStatus.Failed }
}

export default useGetVotingPower
