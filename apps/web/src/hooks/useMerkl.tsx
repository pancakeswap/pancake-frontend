import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { TokenInfo } from '@pancakeswap/token-lists'
import { useToast } from '@pancakeswap/uikit'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ToastDescriptionWithTx } from 'components/Toast'
import { distributorABI } from 'config/abi/AngleProtocolDistributor'
import { DISTRIBUTOR_ADDRESSES } from 'config/merkl'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import first from 'lodash/first'
import uniq from 'lodash/uniq'
import { useCallback, useMemo } from 'react'
import { useAllLists } from 'state/lists/hooks'
import { getContract } from 'utils/contractHelpers'
import { Address, useWalletClient } from 'wagmi'

export const MERKL_API_V2 = 'https://api.angle.money/v2/merkl'

export function useMerklInfo(poolAddress: string | null): {
  rewardsPerToken: CurrencyAmount<Currency>[]
  isPending: boolean
  transactionData: {
    claim: string
    token: string
    leaf: string
    proof?: string[]
  } | null
  hasMerkl: boolean
  refreshData: () => void
} {
  const { account, chainId } = useAccountActiveChain()
  const queryClient = useQueryClient()

  const {
    data: merklDataV2,
    isPending: isMerklPending,
    refetch: refetchMerkl,
  } = useQuery({
    queryKey: [`fetchMerkl-${chainId}-${account || 'no-account'}`],
    queryFn: async () => {
      if (account) {
        const responsev2 = await fetch(
          `${MERKL_API_V2}?chainIds[]=${chainId}${account ? `&user=${account}` : ''}&AMMs[]=pancakeswapv3`,
        )
        if (responsev2.ok) {
          return responsev2.json()
        }
        return undefined
      }
      const responsev2 = await fetch(`${MERKL_API_V2}?chainIds[]=${chainId}&AMMs[]=pancakeswapv3`)
      if (responsev2.ok) {
        return responsev2.json()
      }
      return undefined
    },
    enabled: Boolean(chainId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  const { data, isPending, refetch } = useQuery({
    queryKey: [`fetchMerkl-${chainId}-${poolAddress}`],
    queryFn: async () => {
      const queryMerklDataV2 = queryClient.getQueryCache().find({
        queryKey: [`fetchMerkl-${chainId}-${account || 'no-account'}`],
      })?.state?.data
      if (!queryMerklDataV2 || !queryMerklDataV2[chainId!]) return null

      const { pools, transactionData } = queryMerklDataV2[chainId!]

      const hasLive = first(
        Object.keys(pools)
          .filter((poolId) => poolId === poolAddress && pools[poolId].meanAPR !== 0)
          .map((poolId) => pools[poolId]),
      )

      const merklPoolData = first(
        Object.keys(pools)
          .filter((poolId) => poolId === poolAddress)
          .map((poolId) => pools[poolId]),
      )

      const rewardsPerTokenObject = merklPoolData?.rewardsPerToken

      const rewardsPerToken = rewardsPerTokenObject
        ? Object.keys(rewardsPerTokenObject)
            .map((tokenAddress) => {
              const tokenInfo = rewardsPerTokenObject[tokenAddress]

              const token = new Token(chainId as number, tokenAddress as Address, tokenInfo.decimals, tokenInfo.symbol)

              return CurrencyAmount.fromRawAmount(token, tokenInfo.unclaimedUnformatted)
            })
            .filter(Boolean)
        : []

      return {
        hasMerkl: Boolean(hasLive),
        rewardsPerToken,
        rewardTokenAddresses: uniq(merklPoolData?.distributionData?.map((d) => d.token)),
        transactionData,
      }
    },
    enabled: Boolean(chainId && merklDataV2),
  })

  const lists = useAllLists()

  return useMemo(() => {
    if (!data)
      return {
        hasMerkl: false,
        rewardsPerToken: [],
        transactionData: null,
        refreshData: async () => {
          await refetchMerkl()
          await refetch()
        },
        isPending: isPending || isMerklPending,
      }

    const { rewardsPerToken = [], rewardTokenAddresses = [], ...rest } = data

    const rewardCurrencies = (rewardTokenAddresses as string[])
      .reduce<TokenInfo[]>((result, address) => {
        Object.values(lists).find((list) => {
          const token: TokenInfo | undefined = list?.current?.tokens.find((t) => t.address === address)

          if (token) return result.push(token)

          return false
        })

        return result
      }, [])
      .map((info) => {
        const t = new Token(chainId as number, info.address, info.decimals, info.symbol)

        return CurrencyAmount.fromRawAmount(t, '0')
      })

    return {
      ...rest,
      rewardsPerToken: rewardsPerToken.length ? rewardsPerToken : rewardCurrencies,
      refreshData: async () => {
        await refetchMerkl()
        await refetch()
      },
      isPending: isPending || isMerklPending,
    }
  }, [chainId, data, lists, refetch, refetchMerkl, isPending, isMerklPending])
}

export default function useMerkl(poolAddress: string | null) {
  const { account, chainId } = useAccountActiveChain()

  const { data: signer } = useWalletClient()

  const { transactionData, rewardsPerToken, refreshData, hasMerkl } = useMerklInfo(poolAddress)

  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: isTxPending } = useCatchTxError()
  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  const claimTokenReward = useCallback(async () => {
    const contractAddress = chainId ? DISTRIBUTOR_ADDRESSES[chainId] : undefined

    if (!account || !contractAddress || !signer) return undefined

    const distributorContract = getContract({
      abi: distributorABI,
      address: contractAddress as Address,
      signer,
    })

    if (!transactionData || !distributorContract) return undefined

    const tokens = rewardsPerToken
      .map((rewardToken) => {
        const tokenAddress = rewardToken.currency.wrapped.address
        const tokenTransactionData = transactionData[tokenAddress]

        if (!tokenTransactionData || !tokenTransactionData.proof || tokenTransactionData.claim === '0') return undefined

        return tokenAddress
      })
      .filter(Boolean) as string[]

    const claims = tokens.map((txnData) => transactionData[txnData].claim)
    const proofs = tokens.map((txnData) => transactionData[txnData].proof)

    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(distributorContract, 'claim', [
        tokens.map((_) => account),
        tokens,
        claims,
        proofs as string[][],
      ])
    })

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Merkl Rewards are claimed')}
        </ToastDescriptionWithTx>,
      )

      refreshData()
    }

    // Fix eslint warning
    return undefined
  }, [
    chainId,
    account,
    signer,
    transactionData,
    fetchWithCatchTxError,
    rewardsPerToken,
    callWithGasPrice,
    toastSuccess,
    t,
    refreshData,
  ])

  return useMemo(
    () => ({
      hasMerkl,
      rewardsPerToken,
      claimTokenReward,
      isClaiming: isTxPending,
    }),
    [claimTokenReward, hasMerkl, isTxPending, rewardsPerToken],
  )
}
