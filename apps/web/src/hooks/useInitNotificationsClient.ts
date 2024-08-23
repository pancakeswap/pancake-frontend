import { initWeb3InboxClient } from '@web3inbox/react'
import { APP_DOMAIN, WEB_NOTIFICATIONS_PROJECT_ID } from 'views/Notifications/constants'

const useInitNotificationsClient = () => {
  initWeb3InboxClient({
    projectId: WEB_NOTIFICATIONS_PROJECT_ID,
    domain: APP_DOMAIN,
    allApps: true,
  })
}
export default useInitNotificationsClient
