import { PancakeNotificationBuilders, pushNotification } from './types'

if (!process.env.NEXT_PUBLIC_PROJECT_ID) throw new Error('`NEXT_PUBLIC_PROJECT_ID` env variable is missing.')

export const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID
export const DEFAULT_RELAY_URL = 'https://cast.walletconnect.com'

export const DEFAULT_LOGGER = 'debug'

export const DEFAULT_APP_METADATA = {
  description: 'local',
  icons: ['https://i.imgur.com/q9QDRXc.png'],
  name: 'local',
  url: 'https://pc-custom-web.vercel.app',
}

export const PancakeNotifications: {
  [notificationBuilder in keyof PancakeNotificationBuilders]: <T>(args: T[]) => pushNotification
} = {
  OnBoardNotification: (): pushNotification => {
    return {
      title: 'Welcome Aboard',
      body: 'You have successfully subscribed to Pancake Notifications Wooo!',
      icon: `${window.location.href}logo.png`,
      url: 'https://pc-custom-web.vercel.app',
      type: 'alerts',
    }
  },
  newLpNotification: (): pushNotification => {
    return {
      title: 'New LP Position Added',
      body: `New LP position successfully added. you will be notified on important updates.`,
      icon: `${window.location.href}logo.png`,
      url: 'https://pc-custom-web.vercel.app',
      type: 'Liquidity',
    }
    // ... add more as we create use cases
  },
}
