import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Toggle, Box } from '@pancakeswap/uikit'
import Divider from 'components/Divider'
import {
  DEFAULT_NOTIFICATIONS,
  DummyNotificationData,
  DummyNotifyType,
  NotifyType,
} from 'views/Notifications/constants'

interface ISettingsprops {
  title: string
  description: string
  checked: boolean
  onChange: () => void
}

interface INotificationprops {
  title: string
  description: string
}

const Settingsitem = ({ title, description, checked, onChange }: ISettingsprops) => {
  const { t } = useTranslation()
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
        <Toggle id="toggle-expert-mode-button" scale="md" checked={checked} onChange={onChange} />
      </Flex>
    </>
  )
}

const NotificationItem = ({ title, description }: INotificationprops) => {
  const { t } = useTranslation()
  return (
    <>
      <Divider />
      <Flex flexDirection="column" mt="8px">
        <Flex alignItems="center">
          <div
            style={{
              backgroundColor: 'green',
              height: '13px',
              width: '13px',
              borderRadius: '50%',
            }}
          />
          <Text fontWeight="bold" fontSize="16px" paddingLeft="8px">
            {t(`${title}`)}
          </Text>
        </Flex>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Text color="textSubtle">{t(`${description}`)}</Text>
      </Flex>
    </>
  )
}

export const NotificationContainer = () => {
  return (
    <>
      <Box>
        {DummyNotificationData.map((notification: DummyNotifyType) => {
          return <NotificationItem title={notification.title} description={notification.description} />
        })}
      </Box>
    </>
  )
}

const SettingsContainer = () => {
  return (
    <>
      <Box>
        <Divider />
        {DEFAULT_NOTIFICATIONS.map((notification: NotifyType) => {
          return (
            <Settingsitem
              title={notification.title}
              description={notification.description}
              checked={notification.checked}
              onChange={notification.onChange}
            />
          )
        })}
      </Box>
    </>
  )
}

export default SettingsContainer
