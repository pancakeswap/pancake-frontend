// eslint-disable-next-line camelcase
import { Distributor__factory, MerklAPIData, registry } from '@angleprotocol/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallback, useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { getContract } from 'utils/contractHelpers'
import { Address, useWalletClient } from 'wagmi'

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
} {
  const { account, chainId } = useAccountActiveChain()

  const { data, isLoading } = useSWRImmutable(
    chainId && account && poolAddress ? `fetchMerkl-${chainId}-${account}` : null,
    async () => {
      const response = await fetch(`${MERKL_API}?chainId=${chainId}&user=${account}&AMMs[]=pancakeswapv3`)
      const merklData = (await response.json()) as MerklAPIData | undefined

      if (!merklData) return null

      const { pools } = merklData

      const merklPoolData = Object.keys(pools)
        .filter((poolId) => poolId === poolAddress)
        .map((poolId) => pools[poolId])[0]

      if (!merklPoolData) return null

      const rewardsPerTokenObject = merklPoolData?.rewardsPerToken

      const rewardsPerToken = rewardsPerTokenObject
        ? Object.keys(rewardsPerTokenObject).map((tokenAddress) => {
            const tokenInfo = rewardsPerTokenObject[tokenAddress]

            const token = new Token(chainId as number, tokenAddress as Address, tokenInfo.decimals, tokenInfo.symbol)

            return CurrencyAmount.fromRawAmount(token, tokenInfo.unclaimedUnformatted)
          })
        : []

      return {
        rewardsPerToken,
        transactionData: merklData.transactionData,
        isLoading,
      }
    },
  )

  return useMemo(
    () =>
      data || {
        rewardsPerToken: [],
        transactionData: null,
      },
    [data],
  )
}

export default function useMerkl(poolAddress: string | null) {
  const { account, chainId } = useAccountActiveChain()

  const { data: signer } = useWalletClient()

  const { transactionData, rewardsPerToken } = useMerklInfo(poolAddress)

  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: isTxPending } = useCatchTxError()
  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  const claimTokenReward = useCallback(async () => {
    const contractAddress = chainId ? registry(chainId)?.Merkl?.Distributor : undefined

    if (!account || !contractAddress || !signer) return undefined

    const distributorContract = getContract({
      // eslint-disable-next-line camelcase
      abi: Distributor__factory.abi,
      address: contractAddress as Address,
      signer,
    })

    if (!transactionData || !distributorContract) return undefined

    const tokens = Object.keys(transactionData).filter((k) => transactionData[k].proof !== undefined)
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
    }

    // Fix eslint warning
    return undefined
  }, [chainId, account, signer, transactionData, fetchWithCatchTxError, callWithGasPrice, toastSuccess, t])

  return useMemo(
    () => ({
      rewardsPerToken,
      claimTokenReward,
      isClaiming: isTxPending,
    }),
    [claimTokenReward, isTxPending, rewardsPerToken],
  )
}
