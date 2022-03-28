import { useWeb3React } from '@web3-react/core'
import { FetchStatus } from 'config/constants/types'
import useSWRImmutable from 'swr/immutable'
import { getAddress } from 'utils/addressHelpers'
import { getActivePools } from 'utils/calls'
import { simpleRpcProvider } from 'utils/providers'
import { getVotingPower } from '../helpers'

interface State {
  cakeBalance: number
  cakeVaultBalance: number
  cakePoolBalance: number
  poolsBalance: number
  cakeBnbLpBalance: number
  ifoPoolBalance: number
  total: number
}

const useGetVotingPower = (block?: number, isActive = true): State & { isLoading: boolean; isError: boolean } => {
  const { account } = useWeb3React()
  const { data, status, error } = useSWRImmutable(
    account && isActive ? [account, block, 'votingPower'] : null,
    async () => {
      const blockNumber = block || (await simpleRpcProvider.getBlockNumber())
      const eligiblePools = await getActivePools(blockNumber)
      const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress))
      const { cakeBalance, cakeBnbLpBalance, cakePoolBalance, total, poolsBalance, cakeVaultBalance, ifoPoolBalance } =
        await getVotingPower(account, poolAddresses, blockNumber)
      return {
        cakeBalance: parseFloat(cakeBalance),
        cakeBnbLpBalance: parseFloat(cakeBnbLpBalance),
        cakePoolBalance: parseFloat(cakePoolBalance),
        poolsBalance: parseFloat(poolsBalance),
        cakeVaultBalance: parseFloat(cakeVaultBalance),
        ifoPoolBalance: ifoPoolBalance ? parseFloat(ifoPoolBalance) : 0,
        total: parseFloat(total),
      }
    },
  )
  if (error) console.error(error)

  return { ...data, isLoading: status !== FetchStatus.Fetched, isError: status === FetchStatus.Failed }
}

export default useGetVotingPower
