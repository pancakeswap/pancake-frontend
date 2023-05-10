import { ChainId, Pair, ERC20Token } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import flatMap from 'lodash/flatMap'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { useCallback, useMemo } from 'react'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config/constants/exchange'
import useSWRImmutable from 'swr/immutable'
import { useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { isAddress } from 'utils'
import { useFeeData, useWalletClient } from 'wagmi'
import { Hex, hexToBigInt } from 'viem'
import { useUserState } from 'state/user/reducer'
import {
  addSerializedPair,
  addSerializedToken,
  FarmStakedOnly,
  removeSerializedToken,
  SerializedPair,
  updateUserDeadline,
  updateUserFarmStakedOnly,
  updateGasPrice,
  addWatchlistToken,
  addWatchlistPool,
  updateUserPoolStakedOnly,
  updateUserPoolsViewMode,
  ViewMode,
  updateUserFarmsViewMode,
  updateUserPredictionChartDisclaimerShow,
  updateUserPredictionChainlinkChartDisclaimerShow,
  updateUserPredictionAcceptedRisk,
  updateUserUsernameVisibility,
  setIsExchangeChartDisplayed,
  setSubgraphHealthIndicatorDisplayed,
  updateUserLimitOrderAcceptedWarning,
} from '../actions'
import { GAS_PRICE_GWEI } from '../../types'

// Get user preference for exchange price chart
// For mobile layout chart is hidden by default
export function useExchangeChartManager(isMobile: boolean): [boolean, (isDisplayed: boolean) => void] {
  const [{ isExchangeChartDisplayed: isChartDisplayed }, dispatch] = useUserState()

  const setUserChartPreference = useCallback(
    (isDisplayed: boolean) => {
      dispatch(setIsExchangeChartDisplayed(isDisplayed))
    },
    [dispatch],
  )

  return [isMobile ? false : isChartDisplayed, setUserChartPreference]
}
export function useSubgraphHealthIndicatorManager() {
  const [{ isSubgraphHealthIndicatorDisplayed }, dispatch] = useUserState()

  const setSubgraphHealthIndicatorDisplayedPreference = useCallback(
    (newIsDisplayed: boolean) => {
      dispatch(setSubgraphHealthIndicatorDisplayed(newIsDisplayed))
    },
    [dispatch],
  )

  return [isSubgraphHealthIndicatorDisplayed, setSubgraphHealthIndicatorDisplayedPreference] as const
}

export function useUserFarmStakedOnly(isActive: boolean): [boolean, (stakedOnly: boolean) => void] {
  const [{ userFarmStakedOnly }, dispatch] = useUserState()

  const setUserFarmStakedOnly = useCallback(
    (stakedOnly: boolean) => {
      const farmStakedOnly = stakedOnly ? FarmStakedOnly.TRUE : FarmStakedOnly.FALSE
      dispatch(updateUserFarmStakedOnly({ userFarmStakedOnly: farmStakedOnly }))
    },
    [dispatch],
  )

  return [
    userFarmStakedOnly === FarmStakedOnly.ON_FINISHED ? !isActive : userFarmStakedOnly === FarmStakedOnly.TRUE,
    setUserFarmStakedOnly,
  ]
}

export function useUserPoolStakedOnly(): [boolean, (stakedOnly: boolean) => void] {
  const [{ userPoolStakedOnly }, dispatch] = useUserState()

  const setUserPoolStakedOnly = useCallback(
    (stakedOnly: boolean) => {
      dispatch(updateUserPoolStakedOnly({ userPoolStakedOnly: stakedOnly }))
    },
    [dispatch],
  )

  return [userPoolStakedOnly, setUserPoolStakedOnly]
}

export function useUserPoolsViewMode(): [ViewMode, (viewMode: ViewMode) => void] {
  const [{ userPoolsViewMode }, dispatch] = useUserState()

  const setUserPoolsViewMode = useCallback(
    (viewMode: ViewMode) => {
      dispatch(updateUserPoolsViewMode({ userPoolsViewMode: viewMode }))
    },
    [dispatch],
  )

  return [userPoolsViewMode, setUserPoolsViewMode]
}

export function useUserFarmsViewMode(): [ViewMode, (viewMode: ViewMode) => void] {
  const [{ userFarmsViewMode }, dispatch] = useUserState()

  const setUserFarmsViewMode = useCallback(
    (viewMode: ViewMode) => {
      dispatch(updateUserFarmsViewMode({ userFarmsViewMode: viewMode }))
    },
    [dispatch],
  )

  return [userFarmsViewMode, setUserFarmsViewMode]
}

export function useUserPredictionAcceptedRisk(): [boolean, (acceptedRisk: boolean) => void] {
  const [{ userPredictionAcceptedRisk }, dispatch] = useUserState()

  const setUserPredictionAcceptedRisk = useCallback(
    (acceptedRisk: boolean) => {
      dispatch(updateUserPredictionAcceptedRisk({ userAcceptedRisk: acceptedRisk }))
    },
    [dispatch],
  )

  return [userPredictionAcceptedRisk, setUserPredictionAcceptedRisk]
}

export function useUserLimitOrderAcceptedWarning(): [boolean, (acceptedRisk: boolean) => void] {
  const [{ userLimitOrderAcceptedWarning }, dispatch] = useUserState()

  const setUserLimitOrderAcceptedWarning = useCallback(
    (acceptedRisk: boolean) => {
      dispatch(updateUserLimitOrderAcceptedWarning({ userAcceptedRisk: acceptedRisk }))
    },
    [dispatch],
  )

  return [userLimitOrderAcceptedWarning, setUserLimitOrderAcceptedWarning]
}

export function useUserPredictionChartDisclaimerShow(): [boolean, (showDisclaimer: boolean) => void] {
  const [{ userPredictionChartDisclaimerShow }, dispatch] = useUserState()

  const setPredictionUserChartDisclaimerShow = useCallback(
    (showDisclaimer: boolean) => {
      dispatch(updateUserPredictionChartDisclaimerShow({ userShowDisclaimer: showDisclaimer }))
    },
    [dispatch],
  )

  return [userPredictionChartDisclaimerShow, setPredictionUserChartDisclaimerShow]
}

export function useUserPredictionChainlinkChartDisclaimerShow(): [boolean, (showDisclaimer: boolean) => void] {
  const [{ userPredictionChainlinkChartDisclaimerShow }, dispatch] = useUserState()

  const setPredictionUserChainlinkChartDisclaimerShow = useCallback(
    (showDisclaimer: boolean) => {
      dispatch(updateUserPredictionChainlinkChartDisclaimerShow({ userShowDisclaimer: showDisclaimer }))
    },
    [dispatch],
  )

  return [userPredictionChainlinkChartDisclaimerShow, setPredictionUserChainlinkChartDisclaimerShow]
}

export function useUserUsernameVisibility(): [boolean, (usernameVisibility: boolean) => void] {
  const [{ userUsernameVisibility }, dispatch] = useUserState()

  const setUserUsernameVisibility = useCallback(
    (usernameVisibility: boolean) => {
      dispatch(updateUserUsernameVisibility({ userUsernameVisibility: usernameVisibility }))
    },
    [dispatch],
  )

  return [userUsernameVisibility, setUserUsernameVisibility]
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const [{ userDeadline }, dispatch] = useUserState()

  const setUserDeadline = useCallback(
    (deadline: number) => {
      dispatch(updateUserDeadline({ userDeadline: deadline }))
    },
    [dispatch],
  )

  return [userDeadline, setUserDeadline]
}

export function useAddUserToken(): (token: ERC20Token) => void {
  const [, dispatch] = useUserState()
  return useCallback(
    (token: ERC20Token) => {
      dispatch(addSerializedToken({ serializedToken: token.serialize }))
    },
    [dispatch],
  )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const [, dispatch] = useUserState()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch],
  )
}

export function useFeeDataWithGasPrice(chainIdOverride?: number): {
  gasPrice?: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
} {
  const { chainId: chainId_ } = useActiveChainId()
  const chainId = chainIdOverride ?? chainId_
  const gasPrice = useGasPrice(chainId)
  const { data } = useFeeData({
    chainId,
    enabled: chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET,
    watch: true,
  })

  if (gasPrice) {
    return {
      gasPrice,
    }
  }

  return {
    gasPrice: data?.gasPrice,
    maxFeePerGas: data?.maxFeePerGas,
    maxPriorityFeePerGas: data?.maxPriorityFeePerGas,
  }
}

const DEFAULT_BSC_GAS_BIGINT = BigInt(GAS_PRICE_GWEI.default)
const DEFAULT_BSC_TESTNET_GAS_BIGINT = BigInt(GAS_PRICE_GWEI.testnet)
/**
 * Note that this hook will only works well for BNB chain
 */
export function useGasPrice(chainIdOverride?: number): bigint | undefined {
  const { chainId: chainId_ } = useActiveChainId()
  const chainId = chainIdOverride ?? chainId_
  const { data: signer } = useWalletClient({ chainId })
  const [{ gasPrice: userGas }] = useUserState()
  const { data: bscProviderGasPrice = DEFAULT_BSC_GAS_BIGINT } = useSWR(
    signer && chainId === ChainId.BSC && userGas === GAS_PRICE_GWEI.rpcDefault && ['bscProviderGasPrice', signer],
    async () => {
      // @ts-ignore
      const gasPrice = await signer?.request({
        method: 'eth_gasPrice',
      })
      return hexToBigInt(gasPrice as Hex)
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
  if (chainId === ChainId.BSC) {
    return userGas === GAS_PRICE_GWEI.rpcDefault ? bscProviderGasPrice : BigInt(userGas ?? GAS_PRICE_GWEI.default)
  }
  if (chainId === ChainId.BSC_TESTNET) {
    return DEFAULT_BSC_TESTNET_GAS_BIGINT
  }
  return undefined
}

export function useGasPriceManager(): [string, (userGasPrice: string) => void] {
  const [{ gasPrice: userGasPrice }, dispatch] = useUserState()

  const setGasPrice = useCallback(
    (gasPrice: string) => {
      dispatch(updateGasPrice({ gasPrice }))
    },
    [dispatch],
  )

  return [userGasPrice, setGasPrice]
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: pair.token0.serialize,
    token1: pair.token1.serialize,
  }
}

export function usePairAdder(): (pair: Pair) => void {
  const [, dispatch] = useUserState()

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
    },
    [dispatch],
  )
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [ERC20Token, ERC20Token]): ERC20Token {
  return new ERC20Token(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, 'Cake-LP', 'Pancake LPs')
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [ERC20Token, ERC20Token][] {
  const { chainId } = useActiveChainId()
  const tokens = useOfficialsAndUserAddedTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  const { data: farmPairs = [] } = useSWRImmutable(chainId && ['track-farms-pairs', chainId], async () => {
    const farms = await getFarmConfig(chainId)

    const fPairs: [ERC20Token, ERC20Token][] | undefined = farms
      ?.filter((farm) => farm.pid !== 0)
      ?.map((farm) => [deserializeToken(farm.token), deserializeToken(farm.quoteToken)])

    return fPairs
  })

  // pairs for every token against every base
  const generatedPairs: [ERC20Token, ERC20Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop through all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base) => {
                  const baseAddress = isAddress(base.address)

                  if (baseAddress && baseAddress === tokenAddress) {
                    return null
                  }
                  return [base, token]
                })
                .filter((p): p is [ERC20Token, ERC20Token] => p !== null)
            )
          })
        : [],
    [tokens, chainId],
  )

  // pairs saved by users
  const [{ pairs: savedSerializedPairs }] = useUserState()

  const userPairs: [ERC20Token, ERC20Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map((pairId) => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs).concat(farmPairs),
    [generatedPairs, pinnedPairs, userPairs, farmPairs],
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [ERC20Token, ERC20Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted
        ? `${isAddress(tokenA.address)}:${isAddress(tokenB.address)}`
        : `${isAddress(tokenB.address)}:${isAddress(tokenA.address)}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}

export const useWatchlistTokens = (): [string[], (address: string) => void] => {
  const [{ watchlistTokens: savedTokensFromSelector }, dispatch] = useUserState()
  const updatedSavedTokens = useCallback(
    (address: string) => {
      dispatch(addWatchlistToken({ address }))
    },
    [dispatch],
  )
  const savedTokens = useMemo(() => {
    return savedTokensFromSelector ?? []
  }, [savedTokensFromSelector])
  return [savedTokens, updatedSavedTokens]
}

export const useWatchlistPools = (): [string[], (address: string) => void] => {
  const [{ watchlistPools: savedPoolsFromSelector }, dispatch] = useUserState()
  const updateSavedPools = useCallback(
    (address: string) => {
      dispatch(addWatchlistPool({ address }))
    },
    [dispatch],
  )
  const savedPools = useMemo(() => {
    return savedPoolsFromSelector ?? []
  }, [savedPoolsFromSelector])
  return [savedPools, updateSavedPools]
}
