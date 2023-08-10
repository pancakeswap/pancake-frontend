import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, Box, Button, Flex, FlexGap, OptionProps, Select, Text } from '@pancakeswap/uikit'
import { PushClientTypes } from '@walletconnect/push-client'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NotificationFilterTypes, NotificationSortTypes } from 'views/Notifications/constants'
import { FilterContainer, LabelWrapper, NotificationContainerStyled } from 'views/Notifications/styles'
import NotificationItem from '../components/NotificationItem/NotificationItem'
import { SubsctiptionType } from '../types'

interface INotificationFilterProps {
  options: OptionProps[]
  onOptionChange: (option: OptionProps) => void
  description: string
  width?: string
}

const NotificationFilter = ({ options, onOptionChange, width, description }: INotificationFilterProps) => {
  const { t } = useTranslation()
  return (
    <FilterContainer>
      <LabelWrapper style={{ width: `${width}` }}>
        <Text textTransform="uppercase" mb="4px" ml="4px">
          {t(`${description}`)}
        </Text>
        <Select onOptionChange={onOptionChange} options={options} />
      </LabelWrapper>
    </FilterContainer>
  )
}
const SettingsModal = () => {
  const [sortOptionsType, setSortOptionsType] = useState<string>('Latest')
  const [notificationType, setNotificationType] = useState<string>('All')
  const [notifications, setNotifications] = useState<PushClientTypes.PushMessageRecord[]>([])
  const { activeSubscriptions, getMessageHistory, currentSubscription, deletePushMessage } =
    useWalletConnectPushClient()
  const { t } = useTranslation()

  const updateMessages = useCallback(async () => {
    if (currentSubscription.topic) {
      try {
        const messageHistory = await getMessageHistory({ topic: currentSubscription.topic })
        setNotifications(Object.values(messageHistory))
      } catch (error) {
        //
      }
    }
  }, [setNotifications, getMessageHistory, currentSubscription.topic])

  const handleNotifyOptionChange = useCallback((option: OptionProps) => {
    setNotificationType(option.value)
  }, [])

  const handleSortOptionChange = useCallback((option: OptionProps) => {
    setSortOptionsType(option.value)
  }, [])

  const removeNotification = useCallback(
    async (id: number) => {
      await deletePushMessage({ id: Number(id) }).then(() => updateMessages())
    },
    [updateMessages, deletePushMessage],
  )

  const removeAllNotifications = useCallback(async () => {
    notifications.forEach((notification) => {
      removeNotification(notification.id)
    })
  }, [notifications, removeNotification])

  const filteredNotifications: any = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const sortFarms = (notifications: any[]): any[] => {
      switch (notificationType) {
        case SubsctiptionType.Liquidity:
          return notifications.filter((notification: PushClientTypes.PushMessageRecord) => {
            const extractedType = notification.message.type
            return extractedType === SubsctiptionType.Liquidity
          })
        case SubsctiptionType.Staking:
          return notifications.filter((notification: PushClientTypes.PushMessageRecord) => {
            const extractedType = notification.message.type
            return extractedType === SubsctiptionType.Staking
          })
        case SubsctiptionType.Pools:
          return notifications.filter((notification: PushClientTypes.PushMessageRecord) => {
            const extractedType = notification.message.type
            return extractedType === SubsctiptionType.Pools
          })
        case SubsctiptionType.Farms:
          return notifications.filter((notification: PushClientTypes.PushMessageRecord) => {
            const extractedType = notification.message.type
            return extractedType === SubsctiptionType.Farms
          })
        case SubsctiptionType.Alerts:
          return notifications.filter((notification: PushClientTypes.PushMessageRecord) => {
            const extractedType = notification.message.type
            return extractedType === SubsctiptionType.Alerts
          })
        default:
          return notifications
      }
    }
    return sortFarms(notifications)
  }, [notifications, notificationType])

  useEffect(() => {
    if (!currentSubscription.topic) return
    updateMessages()
  }, [updateMessages, currentSubscription.topic, activeSubscriptions])

  return (
    <Box paddingBottom="24px">
      <Flex alignItems="center" paddingX="24px">
        <AutoRow gap="12px" marginTop="8px" marginBottom="16px" marginRight="8px">
          <NotificationFilter
            onOptionChange={handleNotifyOptionChange}
            options={NotificationFilterTypes}
            description="Filter By Type"
            width="120px"
          />
          <NotificationFilter
            onOptionChange={handleSortOptionChange}
            options={NotificationSortTypes}
            description="Sort By Date"
            width="100px"
          />
        </AutoRow>
        <Button marginTop="13px" height="40px" maxWidth="95px" variant="primary" onClick={removeAllNotifications}>
          <Text px="4px" fontWeight="bold" color="white">
            {t('Clear')}
          </Text>
        </Button>
      </Flex>
      <Box maxHeight="360px" overflowY="scroll">
        {filteredNotifications.length > 0 ? (
          <NotificationContainerStyled>
            <NotificationItem
              notifications={filteredNotifications}
              sortOptionsType={sortOptionsType}
              removeNotification={removeNotification}
            />
          </NotificationContainerStyled>
        ) : (
          <NotificationContainerStyled>
            <Flex paddingX="26px" alignItems="center" justifyContent="center" height="140px" onClick={() => null}>
              <Image src="/Group883379635.png" alt="#" height={100} width={100} />
            </Flex>
            <FlexGap paddingX="26px" rowGap="16px" flexDirection="column" justifyContent="center" alignItems="center">
              <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
                {t('All Set')}
              </Text>
              <Text fontSize="16px" textAlign="center" color="textSubtle">
                {t(
                  'Any notifications that you recieve will appear here. you willl also recieve moblile notification on your mobile wallet.',
                )}
              </Text>
            </FlexGap>
          </NotificationContainerStyled>
        )}
      </Box>
    </Box>
  )
}

export default SettingsModal
