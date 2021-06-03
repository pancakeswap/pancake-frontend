import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_PRICE } from 'config'
import { getDecimalAmount } from './formatBalance'

export interface UserSettings {
  gasPrice: number
}

export const VERSION = 1.01

export const GAS_SETTINGS = {
  default: DEFAULT_GAS_PRICE,
  fast: 10,
  reallyfast: 15,
}

export const getGasPriceInWei = (amountInGwei: number) => {
  return getDecimalAmount(new BigNumber(amountInGwei), 9)
}

export const getDefaultSettings = (): UserSettings => ({
  gasPrice: GAS_SETTINGS.default,
})

export const getStorageKey = (account: string) => {
  return `pancakeswap_settings_${account}_${VERSION}`
}

export const getSettings = (account: string): UserSettings => {
  try {
    const settingsFromLs = localStorage.getItem(getStorageKey(account))
    return settingsFromLs ? JSON.parse(settingsFromLs) : getDefaultSettings()
  } catch (error) {
    return getDefaultSettings()
  }
}

export const setSettings = (account: string, newSettings: UserSettings) => {
  localStorage.setItem(getStorageKey(account), JSON.stringify(newSettings))
}

export const setSetting = (account: string, newSetting: Partial<UserSettings>) => {
  const currentSettings = getSettings(account)
  setSettings(account, { ...currentSettings, ...newSetting })
}
