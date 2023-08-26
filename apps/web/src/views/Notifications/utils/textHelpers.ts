import { TranslateFunction } from '@pancakeswap/localization'

export const getOnBoardingDescriptionMessage = (
  onboardingStep: 'identity' | 'sync',
  isOnBoarded: boolean,
  t: TranslateFunction,
) => {
  let onBoardingDescription: string = t(
    'Finally, subscribe to notifications to stay informed on the latest news and updates that PancakeSwap has to offer.',
  )
  if (!isOnBoarded) {
    onBoardingDescription =
      onboardingStep === 'sync'
        ? t('Next enable notification syncing between DApp clients. This allows for real time udates')
        : t('Get started with notifications from PancakeSwap. First authorize notifications by signing in your wallet')
  }
  return onBoardingDescription
}

export const getOnBoardingButtonText = (
  onboardingStep: 'identity' | 'sync',
  isOnBoarded: boolean,
  loading: boolean,
  t: TranslateFunction,
) => {
  let buttonText: string = t('Enable Notifications')

  if (loading) buttonText = t('Awaiting signature response')
  if (!isOnBoarded) {
    buttonText = onboardingStep === 'sync' ? t('Sync Push Notification Client') : t('Authorize Push Notifications')
  }
  return buttonText
}

export const getSettingsButtonText = (isUnsubscribing: boolean, objectsAreEqual: boolean, t: TranslateFunction) => {
  let buttonText: string = t('UnSubscribe')
  if (objectsAreEqual) {
    buttonText = isUnsubscribing ? t('UnSubscribing') : t('UnSubscribe')
  } else buttonText = isUnsubscribing ? t('Updating...') : t('Update Preferences')

  return buttonText
}
