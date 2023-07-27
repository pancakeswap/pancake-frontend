import { useTranslation } from '@pancakeswap/localization'
import { Box, CloseIcon, Flex, IconButton, ModalCloseButton, Text, Toggle, useToast } from '@pancakeswap/uikit'
import { initialNotificationState, useNotificationState } from '@pancakeswap/utils/user'
import Divider from 'components/Divider'
import CircleLoader from 'components/Loader/CircleLoader'
import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_NOTIFICATIONS,
  DummyNotificationData,
  DummyNotifyType,
  NotifyType,
} from 'views/Notifications/constants'
import { NotificationType } from 'views/Notifications/types'
import { formatTime } from 'views/Notifications/utils/date'

interface ISettingsprops {
  title: string
  description: string
  type: string
  isToastVisible: boolean
}

interface INotificationprops {
  title: string
  description: string
  id: number
  date: number
  removeNotification: (ids: number[]) => Promise<void>
  key: number
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

const NotificationItem = ({ title, description, id, date, removeNotification, key }: INotificationprops) => {
  const [deleting, setDeleting] = useState<boolean>(false)
  const { t } = useTranslation()
  const formattedDate = formatTime(Math.floor(date / 1000).toString())

  const deleteNotification = useCallback(
    (e) => {
      e.stopPropagation()
      setDeleting(true)
      removeNotification([id]).then(() => setDeleting(false))
    },
    [removeNotification, id],
  )

  return (
    <Box>
      <Flex mt="8px" width="100%">
        <Box maxWidth="5%" marginRight="12px" py="10px">
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
          <div style={{ width: '100%', wordBreak: 'break-all' }}>
            <Text color="textSubtle" fontSize="16px">
              {t(`${description}`)}
            </Text>
          </div>
          <Text fontSize="16px" paddingTop="6px">
            {t(`${formattedDate}`)}
          </Text>
        </Flex>
        <Flex py="8px" justifyContent="center">
          <Box onClick={deleting ? () => null : deleteNotification}>
            {deleting && id === key ? <CircleLoader /> : <CloseIcon cursor="pointer" />}
          </Box>
        </Flex>
      </Flex>
      <hr style={{ border: '1px solid #E7E3EB' }} />
    </Box>
  )
}

export const NotificationContainer = ({
  transactions,
  sortOptionsType,
  removeNotification,
}: {
  transactions: any
  sortOptionsType: string
  removeNotification: (ids: number[]) => Promise<void>
}) => {
  if (transactions.length === 0) return <></>
  return (
    <>
      <Box>
        {transactions
          .sort((a, b) => {
            if (sortOptionsType === 'Latest') return b.date - a.date
            return a.date - b.date
          })
          .map((notification: NotificationType) => {
            return (
              <NotificationItem
                key={notification.id}
                title={notification.title}
                description={notification.description}
                id={notification.id}
                date={notification.date!}
                removeNotification={removeNotification}
              />
            )
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
