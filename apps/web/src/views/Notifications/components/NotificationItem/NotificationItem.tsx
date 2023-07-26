import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import Divider from 'components/Divider'
import { DummyNotificationData, DummyNotifyType } from 'views/Notifications/constants'

interface INotificationprops {
  title: string
  description: string
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

export default NotificationContainer
