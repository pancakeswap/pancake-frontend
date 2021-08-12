import { ChainId } from '@pancakeswap/sdk'
import { createSelector } from '@reduxjs/toolkit'
import store, { AppState } from 'state'
import { GAS_PRICE_GWEI } from 'state/user/hooks/helpers'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = (): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  const stateObject = store.getState()
  const gasSelector = (state: AppState): AppState['user']['gasPrice'] => state.user.gasPrice
  const userGasSelector = createSelector(gasSelector, (gasPrice) => gasPrice)
  const userGas = userGasSelector(stateObject)
  return chainId === ChainId.MAINNET.toString() ? userGas : GAS_PRICE_GWEI.testnet
}

export default getGasPrice
