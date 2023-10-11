// eslint-disable-next-line camelcase
import { Distributor__factory, MerklAPIData, registry } from '@angleprotocol/sdk'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallback, useMemo, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useWalletClient } from 'wagmi'

export const MERKL_API = 'https://api.angle.money/v1/merkl'

export default function useMerkl(merklUser?: string, vaultPool?: string) {
  const { account, chainId } = useAccountActiveChain()
  const [isClaiming, setIsClaiming] = useState(false)
  const { data: signer } = useWalletClient()

  const { data, isLoading } = useSWRImmutable(
    chainId && merklUser ? `fetchMerkl-${chainId}-${merklUser}` : null,
    async () => {
      const response = await fetch(`${MERKL_API}?chainId=${chainId}&user=${merklUser}`)
      const merklData = (await response.json()) as MerklAPIData | undefined

      if (!merklData) return null

      const { pools } = merklData

      const merklPoolData = Object.keys(pools)
        .filter((poolId) => poolId === vaultPool)
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

  // const { transactionData, ...merklInfo } = data || {
  //   apr: 0,
  //   rewardsPerToken: [],
  //   transactionData: null,
  // }

  const claimTokenReward = () => {}

  // const claimTokenReward = useCallback(async () => {
  //   const contractAddress = chainId ? registry(chainId)?.Merkl?.Distributor : undefined

  //   if (!account || !provider || !contractAddress || !transactionData || !merklUser) return undefined

  //   const tokens = Object.keys(transactionData).filter((k) => transactionData[k].proof !== undefined)
  //   const claims = tokens.map((t) => transactionData[t].claim)
  //   const proofs = tokens.map((t) => transactionData[t].proof)

  //   // eslint-disable-next-line camelcase
  //   const contract = Distributor__factory.connect(contractAddress, signer)

  //   setIsClaiming(true)

  //   try {
  //     await (
  //       await contract.claim(
  //         // vaultId
  //         tokens.map((_) => merklUser),
  //         tokens,
  //         claims,
  //         proofs as string[][],
  //       )
  //     ).wait()
  //   } catch (err) {
  //     console.error('claimTokenReward error:', err)
  //   } finally {
  //     setIsClaiming(false)
  //   }
  // }, [account, chainId, transactionData, provider, merklUser])

  return useMemo(() => ({ ...merklInfo, claimTokenReward, isClaiming }), [claimTokenReward, isClaiming, merklInfo])
}
