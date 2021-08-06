import BigNumber from 'bignumber.js'
import { getDecimalAmount } from 'utils/formatBalance'

export const LS_GAS_PRICE_KEY = 'pancake_global_gas_price'

export enum GAS_PRICE_NUM {
  default = 5,
  fast = 6,
  instant = 7,
}

const getGasPriceInWei = (amountInGwei: number): BigNumber => {
  return getDecimalAmount(new BigNumber(amountInGwei), 9)
}

export const GAS_PRICE_GWEI = {
  default: getGasPriceInWei(GAS_PRICE_NUM.default).toString(),
  fast: getGasPriceInWei(GAS_PRICE_NUM.fast).toString(),
  instant: getGasPriceInWei(GAS_PRICE_NUM.instant).toString(),
}

export const getGlobalGasPrice = (): string => {
  return JSON.parse(localStorage.getItem(LS_GAS_PRICE_KEY)) || GAS_PRICE_GWEI.default
}
