import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Box, FlexGap } from '@pancakeswap/uikit'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback } from 'react'
import NotificationHeader from '../components/Notificationheader/Notificationheader'
import NotificationsFilter from '../components/NotificationsFilter/NotificationaFilter'
import { DummyNotificationData } from '../constants'
import { NotificationContainer } from '../components/Settingsitem/SettingsItem'
import { NotificationView } from '../types'

interface ISettingsProps {
  setModalView: Dispatch<SetStateAction<NotificationView>>
  enabled: boolean
}
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
        <Text fontSize="12px" textAlign="center" color="textSubtle">
          {t(
            'Any notifications that you recieve will appear here. you willl also recieve moblile notification on your mobile wallet. Note you may periodically have to reconnect to establis a connection.',
          )}
        </Text>
      </FlexGap>
    </>
  )
}

const SettingsModal = ({ setModalView, enabled }: ISettingsProps) => {
  const onBack = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setModalView(NotificationView.Settings)
    },
    [setModalView],
  )

  return (
    <>
      <NotificationHeader isSettings onBack={onBack} onDismiss={() => null} isEnabled={enabled} />
      <Box paddingX="24px" paddingBottom="24px">
        <NotificationsFilter />
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
    </>
  )
}

export default SettingsModal
