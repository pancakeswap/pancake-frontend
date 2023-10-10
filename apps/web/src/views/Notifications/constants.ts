import { OptionProps } from '@pancakeswap/uikit'
import { EventInformation, PancakeNotificationBuilders, ResponseEvents, pushNotification } from './types'

export const NotificationFilterTypes: OptionProps[] = [
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Lottery',
    value: 'Lottery',
  },
  {
    label: 'Prediction',
    value: 'Prediction',
  },
  {
    label: 'Liquidity',
    value: 'Liquidity',
  },
  {
    label: 'Staking',
    value: 'Staking',
  },
  {
    label: 'Pools',
    value: 'Pools',
  },
  {
    label: 'Farm',
    value: 'Farms',
  },
  {
    label: 'Price Updates',
    value: 'PriceUpdates',
  },
  {
    label: 'Promotional',
    value: 'Promotional',
  },
  {
    label: 'Voting',
    value: 'Voting',
  },
  {
    label: 'Alerts',
    value: 'alerts',
  },
]

export const NotificationSortTypes: OptionProps[] = [
  {
    label: 'Latest',
    value: 'Latest',
  },
  {
    label: 'Oldest',
    value: 'Oldest',
  },
]

export const DEFAULT_RELAY_URL = 'https://notify.walletconnect.com'
export const DEFAULT_CAST_SIGN_KEY = process.env.NEXT_PUBLIC_CAST_SERVER_SIGN_KEY
export const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID
export const WEB_PUSH_ENCRYPTION_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_ENCRYPTION_KEY
export const WEB_PUSH_IV = process.env.NEXT_PUBLIC_WEB_PUSH_IV
export const SECURE_TOKEN = process.env.NEXT_PUBLIC_SECURE_TOKEN

export const PancakeNotifications: {
  [notificationBuilder in keyof PancakeNotificationBuilders]: <T>(args: T[]) => pushNotification
} = {
  OnBoardNotification: (): pushNotification => {
    return {
      title: 'Welcome Aboard',
      body: 'You have successfully subscribed to Pancake Notifications Wooo!',
      icon: `https://pancakeswap.finance/logo.png`,
      url: 'https://pc-custom-web.vercel.app',
      type: 'alerts',
    }
  },
  newLpNotification: (): pushNotification => {
    return {
      title: 'New LP Position Added',
      body: `New LP position successfully added. you will be notified on important updates.`,
      icon: `https://pancakeswap.finance/logo.png`,
      url: 'https://pc-custom-web.vercel.app',
      type: 'Liquidity',
    }
    // ... add more as we create use cases
  },
}

export const Events: { [event in keyof typeof ResponseEvents]: EventInformation } = {
  [ResponseEvents.SignatureRequest]: {
    title: 'Request Sent',
    message: 'Please sign the subscription request sent to your wallet',
  },
  [ResponseEvents.SignatureRequestError]: {
    title: 'Request Error',
    message: 'User rejected the signature request',
  },
  [ResponseEvents.SubscriptionRequestError]: {
    title: 'Subscription Error',
  },
  [ResponseEvents.PreferencesUpdated]: {
    title: 'Success',
    message: 'your notification preferences have been updated.',
  },
  [ResponseEvents.PreferencesError]: {
    title: 'Something went wrong',
    message: 'Unable to update your preferences',
  },
  [ResponseEvents.UnsubscribeError]: {
    title: 'Error',
    message: 'Unable to unsubscribe.',
  },
  [ResponseEvents.Unsubscribed]: {
    title: 'Update',
    message: 'You sucessfully unsubsrcibed from notifications. You can re-subscribe any time',
  },
}

export const supportedNotifyTxTypes = ['add-liquidity', 'add-liquidity-v3', 'increase-liquidity']
