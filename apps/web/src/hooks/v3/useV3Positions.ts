import { PositionDetails } from '@pancakeswap/farms'
import { masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useMemo } from 'react'
import { useContractReads, Address } from 'wagmi'
import { useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'

interface UseV3PositionsResults {
  loading: boolean
  positions: PositionDetails[] | undefined
}

interface UseV3PositionResults {
  loading: boolean
  position: PositionDetails | undefined
}

export function useV3PositionsFromTokenIds(tokenIds: bigint[] | undefined): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContract()
  const { chainId } = useActiveChainId()

  const inputs = useMemo(
    () =>
      tokenIds && positionManager
        ? tokenIds.map((tokenId) => ({
            abi: positionManager.abi,
            address: positionManager.address,
            functionName: 'positions',
            args: [tokenId],
            chainId,
          }))
        : [],
    [chainId, positionManager, tokenIds],
  )
  const { isLoading, data: positions = [] } = useContractReads({
    contracts: inputs,
    watch: true,
    allowFailure: true,
    enabled: !!inputs.length,
    keepPreviousData: true,
  })

  return {
    loading: isLoading,
    positions: useMemo(
      () =>
        positions
          .filter((p) => p.status === 'success')
          .map((p) => {
            const r = p.result
            return {
              nonce: r[0],
              operator: r[1],
              token0: r[2],
              token1: r[3],
              fee: r[4],
              tickLower: r[5],
              tickUpper: r[6],
              liquidity: r[7],
              feeGrowthInside0LastX128: r[8],
              feeGrowthInside1LastX128: r[9],
              tokensOwed0: r[10],
              tokensOwed1: r[11],
            } as Omit<PositionDetails, 'tokenId'>
          })
          .map((position, i) =>
            position && typeof inputs?.[i]?.args[0] !== 'undefined'
              ? {
                  ...position,
                  tokenId: inputs?.[i]?.args[0],
                }
              : null,
          )
          .filter(Boolean),
      [inputs, positions],
    ),
  }
}

export function useV3PositionFromTokenId(tokenId: bigint | undefined): UseV3PositionResults {
  const position = useV3PositionsFromTokenIds(tokenId ? [tokenId] : undefined)

  return useMemo(
    () => ({
      loading: position.loading,
      position: position.positions?.[0],
    }),
    [position.loading, position.positions],
  )
}

export function useV3TokenIdsByAccount(
  contractAddress?: Address,
  account?: Address | null | undefined,
): { tokenIds: bigint[]; loading: boolean } {
  const { result: accountBalance, loading: balanceLoading } = useSingleCallResult({
    contract: useMemo(
      () =>
        contractAddress
          ? {
              abi: masterChefV3ABI,
              address: contractAddress as `0x${string}`,
            }
          : null,
      [contractAddress],
    ),
    args: useMemo(() => [account ?? undefined] as readonly [`0x${string}`], [account]),
    functionName: 'balanceOf',
    options: { enabled: !!account && !!contractAddress },
  })

  const tokenIdCallState = useSingleContractMultipleData({
    contract: useMemo(
      () => ({
        abi: masterChefV3ABI,
        address: contractAddress as `0x${string}`,
      }),
      [contractAddress],
    ),
    args: useMemo(() => {
      const resultArg = []
      if (account) {
        for (let i = 0; i < accountBalance; i++) {
          resultArg.push([account, BigInt(i)])
        }
      }
      return resultArg
    }, [accountBalance, account]),
    functionName: 'tokenOfOwnerByIndex',
  })

  return useMemo(
    () => ({
      tokenIds: tokenIdCallState.map((r) => (!r.error && !r.loading ? r.result : null)).filter(Boolean) as bigint[],
      loading: tokenIdCallState.some((callState) => callState.loading) || balanceLoading,
    }),
    [tokenIdCallState, balanceLoading],
  )
}

export function useV3Positions(account: Address | null | undefined): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContract()
  const masterchefV3 = useMasterchefV3()

  const { tokenIds, loading: tokenIdsLoading } = useV3TokenIdsByAccount(positionManager?.address, account)

  const { tokenIds: stakedTokenIds } = useV3TokenIdsByAccount(masterchefV3?.address, account)

  const totalTokenIds = useMemo(() => [...stakedTokenIds, ...tokenIds], [stakedTokenIds, tokenIds])

  const { positions, loading: positionsLoading } = useV3PositionsFromTokenIds(totalTokenIds)

  return useMemo(
    () => ({
      loading: tokenIdsLoading || positionsLoading,
      positions: positions?.map((position) => ({
        ...position,
        isStaked: Boolean(stakedTokenIds?.find((s) => s === position.tokenId)),
      })),
    }),
    [positions, positionsLoading, stakedTokenIds, tokenIdsLoading],
  )
}
