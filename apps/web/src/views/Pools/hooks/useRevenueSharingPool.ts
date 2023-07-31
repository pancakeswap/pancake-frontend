import useSWR from 'swr'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { publicClient } from 'utils/wagmi'
import { useRevenueSharingPoolContract } from 'hooks/useContract'
import { getRevenueSharingPoolAddress } from 'utils/addressHelpers'
import { Address } from 'viem'
import { revenueSharingPoolABI } from 'config/abi/revenueSharingPool'
import { ONE_WEEK_DEFAULT } from '@pancakeswap/pools'
import BigNumber from 'bignumber.js'
import { useInitialBlockTimestamp } from 'state/block/hooks'

interface RevenueSharingPool {
  balanceOfAt: string
  totalSupplyAt: string
  nextDistributionTimestamp: number
  lastTokenTimestamp: number
  availableClaim: string
}

const initialData: RevenueSharingPool = {
  balanceOfAt: '0',
  totalSupplyAt: '0',
  nextDistributionTimestamp: 0,
  lastTokenTimestamp: 0,
  availableClaim: '0',
}

const useRevenueSharingPool = (): RevenueSharingPool => {
  const { account, chainId } = useAccountActiveChain()
  const contract = useRevenueSharingPoolContract({ chainId })
  const contractAddress = getRevenueSharingPoolAddress(chainId)
  const blockTimestamp = useInitialBlockTimestamp()

  const { data } = useSWR(account && chainId && ['/revenue-sharing-pool', account, chainId], async () => {
    try {
      const now = Math.floor(blockTimestamp / ONE_WEEK_DEFAULT) * ONE_WEEK_DEFAULT
      const revenueCalls = [
        {
          functionName: 'balanceOfAt',
          address: contractAddress as Address,
          abi: revenueSharingPoolABI,
          args: [account, now],
        },
        {
          functionName: 'totalSupplyAt',
          address: contractAddress as Address,
          abi: revenueSharingPoolABI,
          args: [now],
        },
        {
          functionName: 'lastTokenTimestamp',
          address: contractAddress as Address,
          abi: revenueSharingPoolABI,
          args: [],
        },
      ]

      const client = publicClient({ chainId })
      const [revenueResult, claimResult] = await Promise.all([
        client.multicall({
          contracts: revenueCalls,
          allowFailure: true,
        }),
        contract.simulate.claim([account]),
      ])

      const nextDistributionTimestamp = new BigNumber(revenueResult[2].result.toString())
        .plus(ONE_WEEK_DEFAULT)
        .toNumber()

      return {
        balanceOfAt: revenueResult[0].result.toString(),
        totalSupplyAt: revenueResult[1].result.toString(),
        nextDistributionTimestamp,
        lastTokenTimestamp: Number(revenueResult[2].result.toString()),
        availableClaim: claimResult.result.toString(),
      }
    } catch (error) {
      console.error('[ERROR] Fetching Revenue Sharing Pool', error)
      return initialData
    }
  })

  return data ?? initialData
}

export default useRevenueSharingPool
