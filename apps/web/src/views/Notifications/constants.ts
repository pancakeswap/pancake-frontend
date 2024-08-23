import { ChainId } from '@pancakeswap/chains'
import { ContextApi } from '@pancakeswap/localization'
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
    label: 'Liquidity',
    value: SubsctiptionType.Liquidity,
  },
  {
    label: 'Alerts',
    value: SubsctiptionType.Alerts,
  },
  {
    label: 'Prediction',
    value: SubsctiptionType.Prediction,
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
    label: 'Lottery',
    value: SubsctiptionType.Lottery,
  },
  {
    label: 'Farm',
    value: SubsctiptionType.Farms,
  },
  {
    label: 'Rewards',
    value: SubsctiptionType.TradingReward,
  },
]

export const WEB_NOTIFICATIONS_PROJECT_ID = 'e542ff314e26ff34de2d4fba98db70bb'
export const NEXT_PUBLIC_WEB_NOTIFICATION_SECURE_TOKEN = process.env.NEXT_PUBLIC_WEB_NOTIFICATION_SECURE_TOKEN ?? ''
export const WEB_PUSH_ENCRYPTION_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_ENCRYPTION_KEY ?? ''
export const WEB_PUSH_IV = process.env.NEXT_PUBLIC_WEB_PUSH_IV ?? ''

export const PancakeNotifications: {
  [notificationBuilder in keyof PancakeNotificationBuilders]: <T>(t: ContextApi['t'], args: T[]) => pushNotification
} = {
  newLpNotification: (t): pushNotification => {
    return {
      title: t('New LP Position Added'),
      body: t('New LP position successfully added. You will be notified on important updates.'),
      icon: `https://pancakeswap.finance/logo.png`,
      url: 'https://pancakeswap.finance',
      type: SubsctiptionType.Liquidity,
    }
  },
  onBoardingNotification: (t): pushNotification => {
    return {
      title: t('Welcome to PancakeSwap Notifications'),
      body: t(
        'You are now susbscribed and will receive alerts and updates on PCS features. If you dont want to receive notifications you can unsubscribe at any time.',
      ),
      icon: `https://pancakeswap.finance/logo.png`,
      type: SubsctiptionType.Alerts,
    }
  },
}
export const APP_DOMAIN = 'pancakeswap.finance'

export const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY ?? ''

export const Events: { [event in keyof typeof ResponseEvents]: EventInformation } = {
  [ResponseEvents.NotificationsEnabled]: {
    title: (t) => t('Notifications Enabled'),
    message: (t) => t('You can now opt-in to pancakeswap web notifications'),
  },
  [ResponseEvents.NotificationsEnabledError]: {
    title: (t) => t('Error Enabling Notifications'),
    message: (t, error) => t('Something went wrong when trying to enable notifications %error%', { error }),
  },
  [ResponseEvents.SubscriptionRequestError]: {
    title: (t) => t('Subscription Error'),
  },
  [ResponseEvents.PreferencesUpdated]: {
    title: (t) => t('Success'),
    message: (t) => t('Your notification preferences have been updated.'),
  },
  [ResponseEvents.PreferencesError]: {
    title: (t) => t('Something went wrong'),
    message: (t, error) => t('Unable to update your preferences %error%', { error }),
  },
  [ResponseEvents.UnsubscribeError]: {
    title: (t) => t('Error Unsubscribing'),
    message: (t, error) => t('Unable to unsubscribe %error%', { error }),
  },
  [ResponseEvents.Unsubscribed]: {
    title: (t) => t('Update'),
    message: (t) => t('You successfully unsubscribed from notifications. You can re-subscribe any time'),
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
