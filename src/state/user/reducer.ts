import { createReducer } from '@reduxjs/toolkit'
import { SerializedToken } from 'config/constants/types'
import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE } from '../../config/constants'
import { updateVersion } from '../global/actions'
import {
  addSerializedPair,
  addSerializedToken,
  addWatchlistPool,
  addWatchlistToken,
  FarmStakedOnly,
  removeSerializedPair,
  removeSerializedToken,
  SerializedPair,
  muteAudio,
  unmuteAudio,
  updateGasPrice,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserFarmStakedOnly,
  updateUserFarmsViewMode,
  updateUserPoolStakedOnly,
  updateUserPoolsViewMode,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
  ViewMode,
  updateUserPredictionAcceptedRisk,
  updateUserPredictionChartDisclaimerShow,
  updateUserPredictionChainlinkChartDisclaimerShow,
  updateUserUsernameVisibility,
  updateUserExpertModeAcknowledgementShow,
  hidePhishingWarningBanner,
  setIsExchangeChartDisplayed,
  setChartViewMode,
  ChartViewMode,
  setSubgraphHealthIndicatorDisplayed,
  updateUserLimitOrderAcceptedWarning,
} from './actions'
import { GAS_PRICE_GWEI } from './hooks/helpers'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  userExpertMode: boolean

  // only allow swaps on direct pairs
  userSingleHopOnly: boolean

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }

  timestamp: number
  audioPlay: boolean
  isExchangeChartDisplayed: boolean
  isSubgraphHealthIndicatorDisplayed: boolean
  userChartViewMode: ChartViewMode
  userFarmStakedOnly: FarmStakedOnly
  userPoolStakedOnly: boolean
  userPoolsViewMode: ViewMode
  userFarmsViewMode: ViewMode
  userPredictionAcceptedRisk: boolean
  userLimitOrderAcceptedWarning: boolean
  userPredictionChartDisclaimerShow: boolean
  userPredictionChainlinkChartDisclaimerShow: boolean
  userExpertModeAcknowledgementShow: boolean
  userUsernameVisibility: boolean
  gasPrice: string
  watchlistTokens: string[]
  watchlistPools: string[]
  hideTimestampPhishingWarningBanner: number
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: UserState = {
  userExpertMode: false,
  userSingleHopOnly: false,
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
  audioPlay: true,
  isExchangeChartDisplayed: true,
  isSubgraphHealthIndicatorDisplayed: false,
  userChartViewMode: ChartViewMode.BASIC,
  userFarmStakedOnly: FarmStakedOnly.ON_FINISHED,
  userPoolStakedOnly: false,
  userPoolsViewMode: ViewMode.TABLE,
  userFarmsViewMode: ViewMode.TABLE,
  userPredictionAcceptedRisk: false,
  userLimitOrderAcceptedWarning: false,
  userPredictionChartDisclaimerShow: true,
  userPredictionChainlinkChartDisclaimerShow: true,
  userExpertModeAcknowledgementShow: true,
  userUsernameVisibility: false,
  gasPrice: GAS_PRICE_GWEI.default,
  watchlistTokens: [],
  watchlistPools: [],
  hideTimestampPhishingWarningBanner: null,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== 'number') {
        state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== 'number') {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }

      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    .addCase(updateUserExpertMode, (state, action) => {
      state.userExpertMode = action.payload.userExpertMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserSingleHopOnly, (state, action) => {
      state.userSingleHopOnly = action.payload.userSingleHopOnly
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedToken, (state, { payload: { address, chainId } }) => {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[chainId] = state.tokens[chainId] || {}
      delete state.tokens[chainId][address]
      state.timestamp = currentTimestamp()
    })
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const { chainId } = serializedPair.token0
        state.pairs[chainId] = state.pairs[chainId] || {}
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
      }
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedPair, (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
      if (state.pairs[chainId]) {
        // just delete both keys if either exists
        delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)]
        delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)]
      }
      state.timestamp = currentTimestamp()
    })
    .addCase(muteAudio, (state) => {
      state.audioPlay = false
    })
    .addCase(unmuteAudio, (state) => {
      state.audioPlay = true
    })
    .addCase(updateUserFarmStakedOnly, (state, { payload: { userFarmStakedOnly } }) => {
      state.userFarmStakedOnly = userFarmStakedOnly
    })
    .addCase(updateUserPoolStakedOnly, (state, { payload: { userPoolStakedOnly } }) => {
      state.userPoolStakedOnly = userPoolStakedOnly
    })
    .addCase(updateUserPoolsViewMode, (state, { payload: { userPoolsViewMode } }) => {
      state.userPoolsViewMode = userPoolsViewMode
    })
    .addCase(updateUserFarmsViewMode, (state, { payload: { userFarmsViewMode } }) => {
      state.userFarmsViewMode = userFarmsViewMode
    })
    .addCase(updateUserPredictionAcceptedRisk, (state, { payload: { userAcceptedRisk } }) => {
      state.userPredictionAcceptedRisk = userAcceptedRisk
    })
    .addCase(updateUserLimitOrderAcceptedWarning, (state, { payload: { userAcceptedRisk } }) => {
      state.userLimitOrderAcceptedWarning = userAcceptedRisk
    })
    .addCase(updateUserPredictionChartDisclaimerShow, (state, { payload: { userShowDisclaimer } }) => {
      state.userPredictionChartDisclaimerShow = userShowDisclaimer
    })
    .addCase(updateUserPredictionChainlinkChartDisclaimerShow, (state, { payload: { userShowDisclaimer } }) => {
      state.userPredictionChainlinkChartDisclaimerShow = userShowDisclaimer
    })
    .addCase(updateUserExpertModeAcknowledgementShow, (state, { payload: { userExpertModeAcknowledgementShow } }) => {
      state.userExpertModeAcknowledgementShow = userExpertModeAcknowledgementShow
    })
    .addCase(updateUserUsernameVisibility, (state, { payload: { userUsernameVisibility } }) => {
      state.userUsernameVisibility = userUsernameVisibility
    })
    .addCase(updateGasPrice, (state, action) => {
      state.gasPrice = action.payload.gasPrice
    })
    .addCase(addWatchlistToken, (state, { payload: { address } }) => {
      // state.watchlistTokens can be undefined for pre-loaded localstorage user state
      const tokenWatchlist = state.watchlistTokens ?? []
      if (!tokenWatchlist.includes(address)) {
        state.watchlistTokens = [...tokenWatchlist, address]
      } else {
        // Remove token from watchlist
        const newTokens = state.watchlistTokens.filter((x) => x !== address)
        state.watchlistTokens = newTokens
      }
    })
    .addCase(addWatchlistPool, (state, { payload: { address } }) => {
      // state.watchlistPools can be undefined for pre-loaded localstorage user state
      const poolsWatchlist = state.watchlistPools ?? []
      if (!poolsWatchlist.includes(address)) {
        state.watchlistPools = [...poolsWatchlist, address]
      } else {
        // Remove pool from watchlist
        const newPools = state.watchlistPools.filter((x) => x !== address)
        state.watchlistPools = newPools
      }
    })
    .addCase(hidePhishingWarningBanner, (state) => {
      state.hideTimestampPhishingWarningBanner = currentTimestamp()
    })
    .addCase(setIsExchangeChartDisplayed, (state, { payload }) => {
      state.isExchangeChartDisplayed = payload
    })
    .addCase(setChartViewMode, (state, { payload }) => {
      state.userChartViewMode = payload
    })
    .addCase(setSubgraphHealthIndicatorDisplayed, (state, { payload }) => {
      state.isSubgraphHealthIndicatorDisplayed = payload
    }),
)
