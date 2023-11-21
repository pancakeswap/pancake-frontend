import { ONE_WEEK_DEFAULT } from '@pancakeswap/pools'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useRevenueSharingPoolForCakeContract } from 'hooks/useContract'
import { useInitialBlockTimestamp } from 'state/block/hooks'
import { publicClient } from 'utils/wagmi'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

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

export const useRevenueSharingPoolForCake = () => {
  const { account, chainId } = useAccountActiveChain()
  const contract = useRevenueSharingPoolForCakeContract()
  const blockTimestamp = useInitialBlockTimestamp()
  const currencyBlockTimestamp = useCurrentBlockTimestamp()

  const { data } = useQuery(
    ['/revenue-sharing-pool-for-cake', contract.address, contract.chain?.id, account],
    async () => {
      if (!account) return undefined
      try {
        const now = Math.floor(blockTimestamp / ONE_WEEK_DEFAULT) * ONE_WEEK_DEFAULT
        const lastTokenTimestamp = Math.floor(currencyBlockTimestamp / ONE_WEEK_DEFAULT) * ONE_WEEK_DEFAULT

        const revenueCalls = [
          {
            ...contract,
            functionName: 'balanceOfAt',
            args: [account, now],
          },
          {
            ...contract,
            functionName: 'totalSupplyAt',
            args: [now],
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

        const nextDistributionTimestamp = new BigNumber(lastTokenTimestamp).plus(ONE_WEEK_DEFAULT).toNumber()

        return {
          balanceOfAt: (revenueResult[0].result as any).toString(),
          totalSupplyAt: (revenueResult[1].result as any).toString(),
          nextDistributionTimestamp,
          lastTokenTimestamp,
          availableClaim: claimResult.result.toString(),
        }
      } catch (error) {
        console.error('[ERROR] Fetching Revenue Sharing Pool', error)
        return initialData
      }
    },
  )

  return data ?? initialData
}
