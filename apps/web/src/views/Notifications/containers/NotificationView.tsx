import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import Image from 'next/image'
import Divider from 'components/Divider'
import NotificationsFilter from '../components/NotificationsFilter/NotificationaFilter'
import { NotificationContainer } from '../components/Settingsitem/SettingsItem'
import { DummyNotificationData } from '../constants'

const EmptyView = () => {
  const { t } = useTranslation()

  return (
    <>
      <Flex alignItems="center" justifyContent="center" height="140px" onClick={() => null}>
        <Image src="/Group883379635.png" alt="#" height={100} width={100} />
      </Flex>

      <FlexGap rowGap="16px" flexDirection="column" justifyContent="center" alignItems="center">
        <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
          {t('All Set')}
        </Text>
        <Text fontSize="16px" textAlign="center" color="textSubtle">
          {t(
            'Any notifications that you recieve will appear here. you willl also recieve moblile notification on your mobile wallet.',
          )}
        </Text>
      </FlexGap>
    </>
  )
}

const SettingsModal = () => {
  return (
    <Box paddingX="24px" paddingBottom="24px">
      <Divider />

      <NotificationsFilter setNotifyFilterType={() => null} setSortType={() => null} />
      {DummyNotificationData.length === 0 ? (
        <Box marginBottom="56px">
          <NotificationContainer />
        </Box>
      ) : (
        <Box marginBottom="56px">
          <EmptyView />
        </Box>
      )}
    </Box>
  )
}

export default SettingsModal
