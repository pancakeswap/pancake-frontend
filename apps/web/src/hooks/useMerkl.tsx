import { Distributor__factory as DistributorFactory, MerklAPIData, registry } from '@angleprotocol/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallback, useMemo } from 'react'
import { getContract } from 'utils/contractHelpers'
import { Address, useWalletClient } from 'wagmi'
import first from 'lodash/first'
import uniq from 'lodash/uniq'
import { useQuery } from '@tanstack/react-query'
import { useAllLists } from 'state/lists/hooks'
import { TokenInfo } from '@pancakeswap/token-lists'

export const MERKL_API = 'https://api.angle.money/v1/merkl'

export function useMerklInfo(poolAddress: string | null): {
  rewardsPerToken: CurrencyAmount<Currency>[]
  isLoading: boolean
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`fetchMerkl-${chainId}-${poolAddress}-${account || 'no-account'}`],
    queryFn: async () => {
      const response = await fetch(
        `${MERKL_API}?chainId=${chainId}${account ? `&user=${account}` : ''}&AMMs[]=pancakeswapv3`,
      )
      const merklData = (await response.json()) as MerklAPIData | undefined

      if (!merklData) return null

      const { pools } = merklData

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
        ? Object.keys(rewardsPerTokenObject).map((tokenAddress) => {
            const tokenInfo = rewardsPerTokenObject[tokenAddress]

            const token = new Token(chainId as number, tokenAddress as Address, tokenInfo.decimals, tokenInfo.symbol)

            return CurrencyAmount.fromRawAmount(token, tokenInfo.unclaimedUnformatted)
          })
        : []

      return {
        hasMerkl: Boolean(hasLive),
        rewardsPerToken,
        rewardTokenAddresses: uniq(merklPoolData?.distributionData?.map((d) => d.token)),
        transactionData: merklData.transactionData,
        isLoading,
      }
    },
  })

  const lists = useAllLists()

  return useMemo(() => {
    if (!data)
      return {
        rewardsPerToken: [],
        transactionData: null,
        refreshData: refetch,
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
      refreshData: refetch,
    }
  }, [chainId, data, lists, refetch])
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
    const contractAddress = chainId ? registry(chainId)?.Merkl?.Distributor : undefined

    if (!account || !contractAddress || !signer) return undefined

    const distributorContract = getContract({
      abi: DistributorFactory.abi,
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
