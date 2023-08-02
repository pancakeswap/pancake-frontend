import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, Toggle, useToast } from '@pancakeswap/uikit'
import { initialNotificationState, useNotificationState } from '@pancakeswap/utils/user'
import Divider from 'components/Divider'
import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_NOTIFICATIONS,
} from 'views/Notifications/constants'
import { NotifyType } from 'views/Notifications/types'

interface ISettingsprops {
  title: string
  description: string
  type: string
  isToastVisible: boolean
  account: string
}

const Settingsitem = ({ title, description, type, isToastVisible, account }: ISettingsprops) => {
  const { notificationState, toggleNotification } = useNotificationState(type)
  const { t } = useTranslation()
  const { toastSuccess, toastWarning } = useToast()

  const notificationAlert = useCallback(() => {
    toggleNotification()
    if (!isToastVisible) {
      if (!notificationState) {
        fetch("http://localhost:8000/update-user", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            account,
            type: title,
            value: true
          }),
        }).then(async (data) => data.json())
        .then((data) => {
          toastSuccess(
            `${t('Settings Update')}!`,
            <Text>{t(`You will now recieve ${title} alerts`)}</Text>,
            'bottom' as any,
          )
        })
        
      } else {
        fetch("http://localhost:8000/update-user", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            account,
            type: title,
            value: false 
          }),
        }).then(() => {
          toastWarning(
            `${t('Settings Update')}!`,
            <Text>
              {t(`you have deactivated ${title} alert and will not recieve notifications until turned back on`)}
            </Text>,
            'bottom' as any,
          )
        })
        
      }
    }
  }, [toastSuccess, toggleNotification, notificationState, t, title, isToastVisible, toastWarning, account])

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

const SettingsContainer = ({ account }: { account: string }) => {
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
              key={notification.title}
              title={notification.title}
              description={notification.description}
              type={types[index]}
              isToastVisible={isToastVisible}
              account={account}
            />
          )
        })}
      </Box>
    </>
  )
}

export default SettingsContainer
