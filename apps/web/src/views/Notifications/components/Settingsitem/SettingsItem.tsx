import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, Toggle, useToast } from '@pancakeswap/uikit'
import { initialNotificationState, useNotificationState } from '@pancakeswap/utils/user'
import Divider from 'components/Divider'
import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_NOTIFICATIONS,
  DummyNotificationData,
  DummyNotifyType,
  NotifyType,
} from 'views/Notifications/constants'

interface ISettingsprops {
  title: string
  description: string
  type: string
  isToastVisible: boolean
}

interface INotificationprops {
  title: string
  description: string
}

const Settingsitem = ({ title, description, type, isToastVisible }: ISettingsprops) => {
  const { notificationState, toggleNotification } = useNotificationState(type)
  const { t } = useTranslation()
  const { toastSuccess, toastWarning } = useToast()

  const notificationAlert = useCallback(() => {
    toggleNotification()
    if (isToastVisible) {
      if (notificationState) {
        toastSuccess(
          `${t('Settings Update')}!`,
          <Text>{t(`You will now recieve ${title} alerts`)}</Text>,
          'bottom' as any,
        )
      } else {
        toastWarning(
          `${t('Settings Update')}!`,
          <Text>
            {t(`you have deactivated ${title} alert and will not recieve notifications until turned back on`)}
          </Text>,
          'bottom' as any,
        )
      }
    }
  }, [toastSuccess, toggleNotification, notificationState, t, title, isToastVisible, toastWarning])

  return (
    <>
      <Flex flexDirection="column" mt="8px">
        <Text fontWeight="bold" fontSize="16px">
          {t(`${title}`)}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Flex alignItems="center" maxWidth="80%">
          <Text color="textSubtle">{t(`${description}`)}</Text>
        </Flex>
        <Toggle id="toggle-expert-mode-button" scale="md" checked={notificationState} onChange={notificationAlert} />
      </Flex>
    </>
  )
}

const NotificationItem = ({ title, description }: INotificationprops) => {
  const { t } = useTranslation()
  return (
    <Box>
      <Divider />
      <Flex mt="8px" width="100%">
        <Box maxWidth="5%" marginRight="12px" py="8px">
          <div
            style={{
              backgroundColor: 'lightGreen',
              height: '13px',
              width: '13px',
              borderRadius: '50%',
            }}
          />
        </Box>
        <Flex flexDirection="column" my="2px">
          <Text fontWeight="bold" fontSize="19px" paddingBottom="6px">
            {t(`${title}`)}
          </Text>
          <Text color="textSubtle" fontSize="16px">
            {t(`${description}`)}
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export const NotificationContainer = ({ transactions }: { transactions: any }) => {
  if (transactions.length === 0) return <></>
  return (
    <>
      <Box>
        {transactions.map((notification: DummyNotifyType) => {
          return <NotificationItem title={notification.title} description={notification.description} />
        })}
      </Box>
    </>
  )
}

const SettingsContainer = () => {
  const [isToastVisible, setToastVisible] = useState<boolean>(false)

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isToastVisible) {
      const hideToastTimer = setTimeout(() => {
        setToastVisible(false)
      }, 5000)

      return () => {
        clearTimeout(hideToastTimer)
      }
    }
  }, [isToastVisible])

  return (
    <>
      <Box>
        <Divider />
        {DEFAULT_NOTIFICATIONS.map((notification: NotifyType, index: number) => {
          const types = Object.keys(initialNotificationState)
          return (
            <Settingsitem
              title={notification.title}
              description={notification.description}
              type={types[index]}
              isToastVisible={isToastVisible}
            />
          )
        })}
      </Box>
    </>
  )
}

export default SettingsContainer
