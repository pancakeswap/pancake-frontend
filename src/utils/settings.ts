export interface UserSettings {
  gasPrice: string
}

export const VERSION = 1

export const GAS_SETTINGS = {
  default: '5000000000', // 5
  fast: '10000000000', // 10
  rapid: '15000000000', // 15
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
