import { OptionProps } from '@pancakeswap/uikit'
import { EventInformation, PancakeNotificationBuilders, ResponseEvents, pushNotification } from './types'

export const NotificationFilterTypes: OptionProps[] = [
  {
    label: 'All',
    value: 'All',
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

export const DEFAULT_CAST_SIGN_KEY = process.env.NEXT_PUBLIC_CAST_SERVER_SIGN_KEY
export const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'a14938037e06221040c0fa6a69a1d95f'
export const DEFAULT_RELAY_URL = 'https://notify.walletconnect.com'
export const WEB_PUSH_ENCRYPTION_KEY =
  process.env.ENCRYPTION_SECRET_KEY || 'ee68a5c2733a30e4d3f3e679ba646d83d12cf4f6ee631a2825f9763445591398'
export const WEB_PUSH_IV = process.env.IV || '359da65b8f571c847706283d8d578a4f'

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
