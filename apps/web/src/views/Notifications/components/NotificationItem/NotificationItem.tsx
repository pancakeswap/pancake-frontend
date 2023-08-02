import { useTranslation } from '@pancakeswap/localization'
import { Box, CloseIcon, Flex, Text } from '@pancakeswap/uikit'
import CircleLoader from 'components/Loader/CircleLoader'
import { useCallback, useState } from 'react'
import { NotificationType } from 'views/Notifications/types'
import { formatTime } from 'views/Notifications/utils/date'

interface INotificationprops {
  title: string
  description: string
  id: number
  date: number
  removeNotification: (ids: number[]) => Promise<void>
  key: number
}

const NotificationItem = ({ title, description, id, date, removeNotification }: INotificationprops) => {
  const [deleting, setDeleting] = useState<boolean>(false)
  const { t } = useTranslation()
  const formattedDate = formatTime(Math.floor(date / 1000).toString())

  const deleteNotification = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
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
            {deleting ? <CircleLoader /> : <CloseIcon cursor="pointer" />}
          </Box>
        </Flex>
      </Flex>
      <hr style={{ border: '1px solid #E7E3EB' }} />
    </Box>
  )
}

const NotificationContainer = ({
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
          .sort((a: NotificationType, b: NotificationType) => {
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
                date={notification.date}
                removeNotification={removeNotification}
              />
            )
          })}
      </Box>
    </>
  )
}

export default NotificationContainer
