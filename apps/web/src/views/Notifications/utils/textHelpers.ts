import type { TranslateFunction } from '@pancakeswap/localization'
import { SubsctiptionType } from '../types'

export const getOnBoardingButtonText = (
  areNotificationsEnabled: boolean,
  isRegistered: boolean,
  isSubscribed: boolean,
  t: TranslateFunction,
) => {
  const isStep1 = Boolean(!areNotificationsEnabled)
  const isStep2 = Boolean(areNotificationsEnabled && !isRegistered)
  const isStep3 = Boolean(isRegistered && !isSubscribed)

  if (isStep1) return t('Enable Notifications')
  if (isStep2) return t('Sign In With Wallet')
  if (isStep3) return t('Subscribe To PancakeSwap')

  return t('Enable Notifications')
}

export const getSettingsButtonText = (isUnsubscribing: boolean, objectsAreEqual: boolean, t: TranslateFunction) => {
  let buttonText: string = t('Unsubscribe')
  if (objectsAreEqual) {
    buttonText = isUnsubscribing ? t('Unsubscribing') : t('Unsubscribe')
  } else buttonText = isUnsubscribing ? t('Updating...') : t('Update Preferences')

  return buttonText
}

export const removeTokensFromAPRString = (aprString: string): string => {
  if (aprString.includes('LP position')) return aprString.replace(/-1:.*$/, '')
  return aprString.replace(/-.*$/, '')
}

export const extractPercentageFromString = (inputString: string): number | null => {
  const percentageMatch = inputString.match(/(\d+(\.\d*)?)%/)
  if (percentageMatch) return Number.parseFloat(percentageMatch[1])
  return null
}

export const extractTokensFromAPRString = (aprString: string): { token1: string; token2: string; chainId: number } => {
  const regex = /-([^:]+):([^:]+):(\d+)/
  const match = aprString.match(regex)
  if (!match) return { token1: '', token2: '', chainId: 56 }
  const token1 = match[1]
  const token2 = match[2]
  const chain = Number.parseInt(match[3], 10)
  return { token1, token2, chainId: chain }
}

export const getLinkText = (type: SubsctiptionType, t: TranslateFunction) => {
  if (type === SubsctiptionType.Farms) return t('View Farm')
  if (type === SubsctiptionType.PriceUpdates) return t('Buy Crypto')
  return t('View Link')
}

export const extractChainIdFromAPRNotification = (inputString: string) => {
  const splitInputString = inputString.split('.')[0]
  const chainIdString = splitInputString.split(' ')
  return chainIdString[chainIdString.length - 1]
}

export const extractChainIdFromMessage = (inputString: string) => {
  const match = inputString.match(/on (\$\{chainId\})/)
  return match ? match[1] : 'bsc'
}

export const getBadgeString = (isAPR: boolean, hasFallen: boolean, percentageChange: number) => {
  return isAPR
    ? `${percentageChange}% APR change `
    : `${hasFallen ? 'Down' : 'Up'} ${hasFallen ? '-' : '+'}${percentageChange}%`
}
