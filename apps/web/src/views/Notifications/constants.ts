import { ChainId } from '@pancakeswap/chains'
import { OptionProps } from '@pancakeswap/uikit'
import {
  EventInformation,
  PancakeNotificationBuilders,
  ResponseEvents,
  SubsctiptionType,
  pushNotification,
} from './types'

export const ONE_DAY_MILLISECONDS = 86400000
export const TWO_MINUTES_MILLISECONDS = 120000

export const NotificationFilterTypes: OptionProps[] = [
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Lottery',
    value: SubsctiptionType.Lottery,
  },
  {
    label: 'Prediction',
    value: SubsctiptionType.Prediction,
  },
  {
    label: 'Liquidity',
    value: SubsctiptionType.Liquidity,
  },
  {
    label: 'Farm',
    value: SubsctiptionType.Farms,
  },
  {
    label: 'Prices',
    value: SubsctiptionType.PriceUpdates,
  },
  {
    label: 'Promotion',
    value: SubsctiptionType.Promotional,
  },
  {
    label: 'Alerts',
    value: SubsctiptionType.Alerts,
  },
  {
    label: 'Rewards',
    value: SubsctiptionType.TradingReward,
  },
  {
    label: 'Archived',
    value: 'Archived',
  },
]

export const NEXT_PUBLIC_WEB_NOTIFICATION_SECURE_TOKEN = process.env.NEXT_PUBLIC_WEB_NOTIFICATION_SECURE_TOKEN ?? ''
export const WEB_PUSH_ENCRYPTION_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_ENCRYPTION_KEY ?? ''
export const WEB_PUSH_IV = process.env.NEXT_PUBLIC_WEB_PUSH_IV ?? ''

export const PancakeNotifications: {
  [notificationBuilder in keyof PancakeNotificationBuilders]: <T>(args: T[]) => pushNotification
} = {
  OnBoardNotification: (): pushNotification => {
    return {
      title: 'Welcome Aboard',
      body: 'You have successfully subscribed to notifications!',
      icon: `https://pancakeswap.finance/logo.png`,
      type: SubsctiptionType.Alerts,
    }
  },
  newLpNotification: (): pushNotification => {
    return {
      title: 'New LP Position Added',
      body: `New LP position successfully added. you will be notified on important updates.`,
      icon: `https://pancakeswap.finance/logo.png`,
      url: 'https://pc-custom-web.vercel.app',
      type: SubsctiptionType.Liquidity,
    }
    // ... add more as we create use cases
  },
}
export const APP_DOMAIN = 'pancakeswap.finance'

export const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY ?? ''

export const Events: { [event in keyof typeof ResponseEvents]: EventInformation } = {
  [ResponseEvents.NotificationsEnabled]: {
    title: 'Notifications Enabled',
    message: () => 'You can now opt-in to pancakeswap web notifications',
  },
  [ResponseEvents.NotificationsEnabledError]: {
    title: 'Error Enabling Notifications',
    message: (error) => `Something went wrong when trying to enable notifications ${error}`,
  },
  [ResponseEvents.SubscriptionRequestError]: {
    title: 'Subscription Error',
  },
  [ResponseEvents.PreferencesUpdated]: {
    title: 'Success',
    message: () => 'Your notification preferences have been updated.',
  },
  [ResponseEvents.PreferencesError]: {
    title: 'Something went wrong',
    message: (error) => `Unable to update your preferences ${error}`,
  },
  [ResponseEvents.UnsubscribeError]: {
    title: 'Error Unsubscribing',
    message: (error) => `Unable to unsubscribe ${error}`,
  },
  [ResponseEvents.Unsubscribed]: {
    title: 'Update',
    message: () => 'You sucessfully unsubsrcibed from notifications. You can re-subscribe any time',
  },
}

export const CHAIN_NAME_TO_CHAIN_ID = {
  bsc: ChainId.BSC,
  ethereum: ChainId.ETHEREUM,
  polygon_zkevm: ChainId.POLYGON_ZKEVM,
  era: ChainId.ZKSYNC,
  arbitrum: ChainId.ARBITRUM_ONE,
  linea: ChainId.LINEA,
  base: ChainId.BASE,
}

export const ENABLE_ALL_SCOPES = [
  SubsctiptionType.Alerts,
  SubsctiptionType.Farms,
  SubsctiptionType.Liquidity,
  SubsctiptionType.Lottery,
  SubsctiptionType.Prediction,
  SubsctiptionType.PriceUpdates,
  SubsctiptionType.Promotional,
]
export const DISABLE_ALL_SCOPES = [SubsctiptionType.Alerts, SubsctiptionType.Liquidity]
