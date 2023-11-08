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

export const getOnBoardingButtonText = (isOnBoarded: boolean, loading: boolean, t: TranslateFunction) => {
  let buttonText: string = t('Enable Notifications')

  if (loading) buttonText = t('Awaiting signature response')
  if (!isOnBoarded) {
    buttonText = t('Authorize Push Notifications')
  }
  return buttonText
}

export const getSettingsButtonText = (isUnsubscribing: boolean, objectsAreEqual: boolean, t: TranslateFunction) => {
  let buttonText: string = t('Unsubscribe')
  if (objectsAreEqual) {
    buttonText = isUnsubscribing ? t('Unsubscribing') : t('Unsubscribe')
  } else buttonText = isUnsubscribing ? t('Updating...') : t('Update Preferences')

  return buttonText
}

export const removeTokensFromAPRString = (aprString: string): string => {
  const removedString = aprString.replace(/-.*$/, '')
  return removedString
}

export const extractPercentageFromString = (inputString: string): number | null => {
  const percentageMatch = inputString.match(/(\d+(\.\d*)?)%/)
  if (percentageMatch) return parseFloat(percentageMatch[1])
  return null
}

export const extractTokensFromAPRString = (aprString: string): { token1: string; token2: string } => {
  const match = aprString.match(/-(.*):(.*)$/)
  if (!match) return { token1: '', token2: '' }
  const token1 = match[1]
  const token2 = match[2]
  return { token1, token2 }
}

// eslint-disable-next-line @typescript-eslint/no-shadow
export const getLinkText = (title: string, t: TranslateFunction) => {
  if (title.includes('APR Update')) return t('View Farm')
  if (title.includes('Balance')) return t('Buy Crypto')
  return t('View Link')
}
