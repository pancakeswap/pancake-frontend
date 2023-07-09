import Notifications from 'views/Notifications'
import { SUPPORTED_CHAINS } from 'views/BuyCrypto/constants'

const NotificationPage = () => {
  return <Notifications />
}


NotificationPage.chains = SUPPORTED_CHAINS

export default NotificationPage
