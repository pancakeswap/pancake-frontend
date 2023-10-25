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
  let buttonText: string = t('UnSubscribe')
  if (objectsAreEqual) {
    buttonText = isUnsubscribing ? t('Unsubscribing') : t('Unsubscribe')
  } else buttonText = isUnsubscribing ? t('Updating...') : t('Update Preferences')

  return buttonText
}
