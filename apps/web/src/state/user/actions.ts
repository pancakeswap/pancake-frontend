import { SerializedWrappedToken } from '@pancakeswap/token-lists'
import { createAction } from '@reduxjs/toolkit'

export interface SerializedPair {
  token0: SerializedWrappedToken
  token1: SerializedWrappedToken
}

export enum FarmStakedOnly {
  ON_FINISHED = 'onFinished',
  TRUE = 'true',
  FALSE = 'false',
}

export enum ViewMode {
  TABLE = 'TABLE',
  CARD = 'CARD',
}

export const addSerializedToken = createAction<{ serializedToken: SerializedWrappedToken }>('user/addSerializedToken')
export const removeSerializedToken = createAction<{ chainId: number; address: string }>('user/removeSerializedToken')
export const addSerializedPair = createAction<{ serializedPair: SerializedPair }>('user/addSerializedPair')
export const removeSerializedPair = createAction<{ chainId: number; tokenAAddress: string; tokenBAddress: string }>(
  'user/removeSerializedPair',
)

export const updateUserFarmStakedOnly = createAction<{ userFarmStakedOnly: FarmStakedOnly }>(
  'user/updateUserFarmStakedOnly',
)
export const updateUserPoolStakedOnly = createAction<{ userPoolStakedOnly: boolean }>('user/updateUserPoolStakedOnly')
export const updateUserPoolsViewMode = createAction<{ userPoolsViewMode: ViewMode }>('user/updateUserPoolsViewMode')
export const updateUserFarmsViewMode = createAction<{ userFarmsViewMode: ViewMode }>('user/updateUserFarmsViewMode')
export const updateUserPredictionAcceptedRisk = createAction<{ userAcceptedRisk: boolean }>(
  'user/updateUserPredictionAcceptedRisk',
)
export const updateUserLimitOrderAcceptedWarning = createAction<{ userAcceptedRisk: boolean }>(
  'user/userLimitOrderAcceptedWarning',
)

export const updateUserPredictionChartDisclaimerShow = createAction<{ userShowDisclaimer: boolean }>(
  'user/updateUserPredictionChartDisclaimerShow',
)
export const updateUserPredictionChainlinkChartDisclaimerShow = createAction<{ userShowDisclaimer: boolean }>(
  'user/updateUserPredictionChainlinkChartDisclaimerShow',
)

export const updateUserUsernameVisibility = createAction<{ userUsernameVisibility: boolean }>(
  'user/updateUserUsernameVisibility',
)
export const updateGasPrice = createAction<{ gasPrice: string }>('user/updateGasPrice')

/**
 * @deprecated
 */
export const addWatchlistToken = createAction<{ address: string }>('user/addWatchlistToken')
/**
 * @deprecated
 */
export const addWatchlistPool = createAction<{ address: string }>('user/addWatchlistPool')

export const setSubgraphHealthIndicatorDisplayed = createAction<boolean>('user/setSubgraphHealthIndicatorDisplayed')
