// eslint-disable-next-line camelcase
import { Distributor__factory, MerklAPIData, registry } from '@angleprotocol/sdk'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallback, useMemo, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { usePublicClient, useWalletClient } from 'wagmi'

export const MERKL_API = 'https://api.angle.money/v1/merkl'

const MERKL_PANCAKESWAPV3_ID = 3

export default function useMerkl(poolAddress?: string) {
  const { account, chainId } = useAccountActiveChain()
  const [isClaiming, setIsClaiming] = useState(false)
  const provider = usePublicClient({ chainId })

  const { data: signer } = useWalletClient()

  const { data, isLoading } = useSWRImmutable(
    chainId && account && poolAddress ? `fetchMerkl-${chainId}-${account}` : null,
    async () => {
      const response = await fetch(`${MERKL_API}?chainId=${chainId}&user=${account}`)
      const merklData = (await response.json()) as MerklAPIData | undefined

      if (!merklData) return null

      const { pools } = merklData

      const merklPoolData = Object.keys(pools)
        .filter((poolId) => pools[poolId].amm === MERKL_PANCAKESWAPV3_ID && poolId === poolAddress)
        .map((poolId) => pools[poolId])[0]

      if (!merklPoolData) return null

      const rewardsPerTokenObject = merklPoolData?.rewardsPerToken

      const rewardsPerToken = rewardsPerTokenObject
        ? Object.keys(rewardsPerTokenObject).map((token) => rewardsPerTokenObject[token])
        : []

      return {
        rewardsPerToken,
        transactionData: merklData.transactionData,
      }
    },
  )

  const { transactionData, rewardsPerToken } = useMemo(
    () =>
      data || {
        rewardsPerToken: [],
        transactionData: null,
      },
    [data],
  )

  const contractAddress = chainId ? registry(chainId)?.Merkl?.Distributor : undefined

  // const contract = Distributor__factory.connect(contractAddress, provider)

  console.log('contractAddress: ', contractAddress)

  const claimTokenReward = useCallback(async () => {
    const contractAddress = chainId ? registry(chainId)?.Merkl?.Distributor : undefined

    if (!account || !contractAddress || !transactionData || !account) return undefined

    const tokens = Object.keys(transactionData).filter((k) => transactionData[k].proof !== undefined)
    const claims = tokens.map((t) => transactionData[t].claim)
    const proofs = tokens.map((t) => transactionData[t].proof)

    // eslint-disable-next-line camelcase
    const contract = Distributor__factory.connect(contractAddress, provider)

    setIsClaiming(true)

    // const { callWithGasPrice } = useCallWithGasPrice()
    // const onApprove = useCallback(async () => {
    //   const receipt = await fetchWithCatchTxError(() => {
    //     return callWithGasPrice(ethContract, 'approve', [spender as Address, MaxUint256])
    //   })

    //   if (receipt?.status) {
    //     toastSuccess(
    //       t('Success!'),
    //       <ToastDescriptionWithTx txHash={receipt.transactionHash}>
    //         {t('Please progress to the next step.')}
    //       </ToastDescriptionWithTx>,
    //     )
    //   }
    // }, [spender, ethContract, t, callWithGasPrice, fetchWithCatchTxError, toastSuccess])

    try {
      await (
        await contract.claim(
          // vaultId
          tokens.map((_) => account),
          tokens,
          claims,
          proofs as string[][],
        )
      ).wait()
    } catch (err) {
      console.error('claimTokenReward error:', err)
    } finally {
      setIsClaiming(false)
    }

    // Fix eslint warning
    return undefined
  }, [chainId, account, transactionData, provider])

  return useMemo(
    () => ({
      rewardsPerToken,
      claimTokenReward,
    }),
    [claimTokenReward, rewardsPerToken],
  )
}
