import { TranslateFunction } from '@pancakeswap/localization'

export const getOnBoardingDescriptionMessage = (isOnBoarded: boolean, t: TranslateFunction) => {
  let onBoardingDescription: string = t(
    'Finally, subscribe to notifications to stay informed on the latest news and updates that PancakeSwap has to offer.',
  )
  if (!isOnBoarded) {
    onBoardingDescription = t(
      'Get started with notifications from PancakeSwap. First authorize notifications by signing in your wallet',
    )
  }
  return onBoardingDescription
}

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
  if (percentageMatch) return parseFloat(percentageMatch[1])
  return null
}

export const extractTokensFromAPRString = (aprString: string): { token1: string; token2: string; chainId: number } => {
  const regex = /-([^:]+):([^:]+):(\d+)/
  const match = aprString.match(regex)
  if (!match) return { token1: '', token2: '', chainId: 56 }
  const token1 = match[1]
  const token2 = match[2]
  const chain = parseInt(match[3], 10)
  return { token1, token2, chainId: chain }
}

// eslint-disable-next-line @typescript-eslint/no-shadow
export const getLinkText = (title: string, t: TranslateFunction) => {
  if (title.includes('APR Update')) return t('View Farm')
  if (title.includes('Balance') || title.includes('Purchase')) return t('Buy Crypto')
  return t('View Link')
}

export const extractWordBeforeFullStop = (inputString: string) => {
  const match = inputString.match(/(\S+)\s*\./)
  return match ? match[1] : 'bsc'
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

export const hasSingleFarm = (inputString: string) => {
  const pattern = /[a-zA-Z]+-[a-zA-Z]+ LP,/
  return !pattern.test(inputString)
}
