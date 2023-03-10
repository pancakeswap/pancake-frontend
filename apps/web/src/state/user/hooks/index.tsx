import { ChainId, Pair, ERC20Token } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import { differenceInDays } from 'date-fns'
import flatMap from 'lodash/flatMap'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config/constants/exchange'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useSWRImmutable from 'swr/immutable'
import { useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import { useWeb3LibraryContext } from '@pancakeswap/wagmi'
import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { isAddress } from 'utils'
import { useFeeData } from 'wagmi'

import { AppState, useAppDispatch } from '../../index'
import {
  addSerializedPair,
  addSerializedToken,
  FarmStakedOnly,
  muteAudio,
  removeSerializedToken,
  SerializedPair,
  unmuteAudio,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserFarmStakedOnly,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
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
  updateUserExpertModeAcknowledgementShow,
  hidePhishingWarningBanner,
  setIsExchangeChartDisplayed,
  ChartViewMode,
  setChartViewMode,
  setSubgraphHealthIndicatorDisplayed,
  updateUserLimitOrderAcceptedWarning,
  setZapDisabled,
} from '../actions'
import { GAS_PRICE_GWEI } from '../../types'

export function useAudioModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const audioPlay = useSelector<AppState, AppState['user']['audioPlay']>((state) => state.user.audioPlay)

  const toggleSetAudioMode = useCallback(() => {
    if (audioPlay) {
      dispatch(muteAudio())
    } else {
      dispatch(unmuteAudio())
    }
  }, [audioPlay, dispatch])

  return [audioPlay, toggleSetAudioMode]
}

export function usePhishingBannerManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const hideTimestampPhishingWarningBanner = useSelector<
    AppState,
    AppState['user']['hideTimestampPhishingWarningBanner']
  >((state) => state.user.hideTimestampPhishingWarningBanner)
  const now = Date.now()
  const notPreview = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'
  const hideBanner = useCallback(() => {
    dispatch(hidePhishingWarningBanner())
  }, [dispatch])
  const showPhishingWarningBanner = hideTimestampPhishingWarningBanner
    ? differenceInDays(now, hideTimestampPhishingWarningBanner) >= 1 && notPreview
    : notPreview

  return [showPhishingWarningBanner, hideBanner]
}

// Get user preference for exchange price chart
// For mobile layout chart is hidden by default
export function useExchangeChartManager(isMobile: boolean): [boolean, (isDisplayed: boolean) => void] {
  const dispatch = useAppDispatch()
  const isChartDisplayed = useSelector<AppState, AppState['user']['isExchangeChartDisplayed']>(
    (state) => state.user.isExchangeChartDisplayed,
  )

  const setUserChartPreference = useCallback(
    (isDisplayed: boolean) => {
      dispatch(setIsExchangeChartDisplayed(isDisplayed))
    },
    [dispatch],
  )

  return [isMobile ? false : isChartDisplayed, setUserChartPreference]
}

export function useExchangeChartViewManager() {
  const dispatch = useAppDispatch()
  const chartViewMode = useSelector<AppState, AppState['user']['userChartViewMode']>(
    (state) => state.user.userChartViewMode,
  )

  const setUserChartViewPreference = useCallback(
    (view: ChartViewMode) => {
      dispatch(setChartViewMode(view))
    },
    [dispatch],
  )

  return [chartViewMode, setUserChartViewPreference] as const
}

export function useZapModeManager() {
  const dispatch = useAppDispatch()
  const zapEnabled = useSelector<AppState, AppState['user']['userZapDisabled']>((state) => !state.user.userZapDisabled)

  const setZapEnable = useCallback(
    (enable: boolean) => {
      dispatch(setZapDisabled(!enable))
    },
    [dispatch],
  )

  return [zapEnabled, setZapEnable] as const
}

export function useSubgraphHealthIndicatorManager() {
  const dispatch = useAppDispatch()
  const isSubgraphHealthIndicatorDisplayed = useSelector<
    AppState,
    AppState['user']['isSubgraphHealthIndicatorDisplayed']
  >((state) => state.user.isSubgraphHealthIndicatorDisplayed)

  const setSubgraphHealthIndicatorDisplayedPreference = useCallback(
    (newIsDisplayed: boolean) => {
      dispatch(setSubgraphHealthIndicatorDisplayed(newIsDisplayed))
    },
    [dispatch],
  )

  return [isSubgraphHealthIndicatorDisplayed, setSubgraphHealthIndicatorDisplayedPreference] as const
}

export function useIsExpertMode(): boolean {
  return useSelector<AppState, AppState['user']['userExpertMode']>((state) => state.user.userExpertMode)
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const expertMode = useIsExpertMode()

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }))
  }, [expertMode, dispatch])

  return [expertMode, toggleSetExpertMode]
}

export function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void] {
  const dispatch = useAppDispatch()

  const singleHopOnly = useSelector<AppState, AppState['user']['userSingleHopOnly']>(
    (state) => state.user.userSingleHopOnly,
  )

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }))
    },
    [dispatch],
  )

  return [singleHopOnly, setSingleHopOnly]
}

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch()
  const userSlippageTolerance = useSelector<AppState, AppState['user']['userSlippageTolerance']>((state) => {
    return state.user.userSlippageTolerance
  })

  const setUserSlippageTolerance = useCallback(
    (slippage: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance: slippage }))
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useUserFarmStakedOnly(isActive: boolean): [boolean, (stakedOnly: boolean) => void] {
  const dispatch = useAppDispatch()
  const userFarmStakedOnly = useSelector<AppState, AppState['user']['userFarmStakedOnly']>((state) => {
    return state.user.userFarmStakedOnly
  })

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
  const dispatch = useAppDispatch()
  const userPoolStakedOnly = useSelector<AppState, AppState['user']['userPoolStakedOnly']>((state) => {
    return state.user.userPoolStakedOnly
  })

  const setUserPoolStakedOnly = useCallback(
    (stakedOnly: boolean) => {
      dispatch(updateUserPoolStakedOnly({ userPoolStakedOnly: stakedOnly }))
    },
    [dispatch],
  )

  return [userPoolStakedOnly, setUserPoolStakedOnly]
}

export function useUserPoolsViewMode(): [ViewMode, (viewMode: ViewMode) => void] {
  const dispatch = useAppDispatch()
  const userPoolsViewMode = useSelector<AppState, AppState['user']['userPoolsViewMode']>((state) => {
    return state.user.userPoolsViewMode
  })

  const setUserPoolsViewMode = useCallback(
    (viewMode: ViewMode) => {
      dispatch(updateUserPoolsViewMode({ userPoolsViewMode: viewMode }))
    },
    [dispatch],
  )

  return [userPoolsViewMode, setUserPoolsViewMode]
}

export function useUserFarmsViewMode(): [ViewMode, (viewMode: ViewMode) => void] {
  const dispatch = useAppDispatch()
  const userFarmsViewMode = useSelector<AppState, AppState['user']['userFarmsViewMode']>((state) => {
    return state.user.userFarmsViewMode
  })

  const setUserFarmsViewMode = useCallback(
    (viewMode: ViewMode) => {
      dispatch(updateUserFarmsViewMode({ userFarmsViewMode: viewMode }))
    },
    [dispatch],
  )

  return [userFarmsViewMode, setUserFarmsViewMode]
}

export function useUserPredictionAcceptedRisk(): [boolean, (acceptedRisk: boolean) => void] {
  const dispatch = useAppDispatch()
  const userPredictionAcceptedRisk = useSelector<AppState, AppState['user']['userPredictionAcceptedRisk']>((state) => {
    return state.user.userPredictionAcceptedRisk
  })

  const setUserPredictionAcceptedRisk = useCallback(
    (acceptedRisk: boolean) => {
      dispatch(updateUserPredictionAcceptedRisk({ userAcceptedRisk: acceptedRisk }))
    },
    [dispatch],
  )

  return [userPredictionAcceptedRisk, setUserPredictionAcceptedRisk]
}

export function useUserLimitOrderAcceptedWarning(): [boolean, (acceptedRisk: boolean) => void] {
  const dispatch = useAppDispatch()
  const userLimitOrderAcceptedWarning = useSelector<AppState, AppState['user']['userLimitOrderAcceptedWarning']>(
    (state) => {
      return state.user.userLimitOrderAcceptedWarning
    },
  )

  const setUserLimitOrderAcceptedWarning = useCallback(
    (acceptedRisk: boolean) => {
      dispatch(updateUserLimitOrderAcceptedWarning({ userAcceptedRisk: acceptedRisk }))
    },
    [dispatch],
  )

  return [userLimitOrderAcceptedWarning, setUserLimitOrderAcceptedWarning]
}

export function useUserPredictionChartDisclaimerShow(): [boolean, (showDisclaimer: boolean) => void] {
  const dispatch = useAppDispatch()
  const userPredictionChartDisclaimerShow = useSelector<
    AppState,
    AppState['user']['userPredictionChartDisclaimerShow']
  >((state) => {
    return state.user.userPredictionChartDisclaimerShow
  })

  const setPredictionUserChartDisclaimerShow = useCallback(
    (showDisclaimer: boolean) => {
      dispatch(updateUserPredictionChartDisclaimerShow({ userShowDisclaimer: showDisclaimer }))
    },
    [dispatch],
  )

  return [userPredictionChartDisclaimerShow, setPredictionUserChartDisclaimerShow]
}

export function useUserPredictionChainlinkChartDisclaimerShow(): [boolean, (showDisclaimer: boolean) => void] {
  const dispatch = useAppDispatch()
  const userPredictionChainlinkChartDisclaimerShow = useSelector<
    AppState,
    AppState['user']['userPredictionChainlinkChartDisclaimerShow']
  >((state) => {
    return state.user.userPredictionChainlinkChartDisclaimerShow
  })

  const setPredictionUserChainlinkChartDisclaimerShow = useCallback(
    (showDisclaimer: boolean) => {
      dispatch(updateUserPredictionChainlinkChartDisclaimerShow({ userShowDisclaimer: showDisclaimer }))
    },
    [dispatch],
  )

  return [userPredictionChainlinkChartDisclaimerShow, setPredictionUserChainlinkChartDisclaimerShow]
}

export function useUserExpertModeAcknowledgementShow(): [boolean, (showAcknowledgement: boolean) => void] {
  const dispatch = useAppDispatch()
  const userExpertModeAcknowledgementShow = useSelector<
    AppState,
    AppState['user']['userExpertModeAcknowledgementShow']
  >((state) => {
    return state.user.userExpertModeAcknowledgementShow
  })

  const setUserExpertModeAcknowledgementShow = useCallback(
    (showAcknowledgement: boolean) => {
      dispatch(updateUserExpertModeAcknowledgementShow({ userExpertModeAcknowledgementShow: showAcknowledgement }))
    },
    [dispatch],
  )

  return [userExpertModeAcknowledgementShow, setUserExpertModeAcknowledgementShow]
}

export function useUserUsernameVisibility(): [boolean, (usernameVisibility: boolean) => void] {
  const dispatch = useAppDispatch()
  const userUsernameVisibility = useSelector<AppState, AppState['user']['userUsernameVisibility']>((state) => {
    return state.user.userUsernameVisibility
  })

  const setUserUsernameVisibility = useCallback(
    (usernameVisibility: boolean) => {
      dispatch(updateUserUsernameVisibility({ userUsernameVisibility: usernameVisibility }))
    },
    [dispatch],
  )

  return [userUsernameVisibility, setUserUsernameVisibility]
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch()
  const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>((state) => {
    return state.user.userDeadline
  })

  const setUserDeadline = useCallback(
    (deadline: number) => {
      dispatch(updateUserDeadline({ userDeadline: deadline }))
    },
    [dispatch],
  )

  return [userDeadline, setUserDeadline]
}

export function useAddUserToken(): (token: ERC20Token) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (token: ERC20Token) => {
      dispatch(addSerializedToken({ serializedToken: token.serialize }))
    },
    [dispatch],
  )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch],
  )
}

export function useFeeDataWithGasPrice(chainIdOverride?: number): {
  gasPrice: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
} {
  const { chainId: chainId_ } = useActiveWeb3React()
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

  return (
    data?.formatted ?? {
      gasPrice: undefined,
    }
  )
}

/**
 * Note that this hook will only works well for BNB chain
 */
export function useGasPrice(chainIdOverride?: number): string | undefined {
  const { chainId: chainId_ } = useActiveWeb3React()
  const library = useWeb3LibraryContext()
  const chainId = chainIdOverride ?? chainId_
  const userGas = useSelector<AppState, AppState['user']['gasPrice']>((state) => state.user.gasPrice)
  const { data: bscProviderGasPrice = GAS_PRICE_GWEI.default } = useSWR(
    library &&
      library.provider &&
      chainId === ChainId.BSC &&
      userGas === GAS_PRICE_GWEI.rpcDefault && ['bscProviderGasPrice', library.provider],
    async () => {
      const gasPrice = await library.getGasPrice()
      return gasPrice.toString()
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
  if (chainId === ChainId.BSC) {
    return userGas === GAS_PRICE_GWEI.rpcDefault ? bscProviderGasPrice : userGas
  }
  if (chainId === ChainId.BSC_TESTNET) {
    return GAS_PRICE_GWEI.testnet
  }
  return undefined
}

export function useGasPriceManager(): [string, (userGasPrice: string) => void] {
  const dispatch = useAppDispatch()
  const userGasPrice = useSelector<AppState, AppState['user']['gasPrice']>((state) => state.user.gasPrice)

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
  const dispatch = useAppDispatch()

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

    const fPairs: [ERC20Token, ERC20Token][] = farms
      .filter((farm) => farm.pid !== 0)
      .map((farm) => [deserializeToken(farm.token), deserializeToken(farm.quoteToken)])

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
  const savedSerializedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)

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
  const dispatch = useAppDispatch()
  const savedTokensFromSelector = useSelector((state: AppState) => state.user.watchlistTokens)
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
  const dispatch = useAppDispatch()
  const savedPoolsFromSelector = useSelector((state: AppState) => state.user.watchlistPools)
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
