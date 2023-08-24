import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, FlexGap, OptionProps, Select, Text } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NotificationFilterTypes, NotificationSortTypes } from 'views/Notifications/constants'
import { FilterContainer, LabelWrapper, NotificationContainerStyled } from 'views/Notifications/styles'
import { PushClient } from 'PushNotificationClient'
import NotificationItem from '../components/NotificationItem/NotificationItem'
import { SubsctiptionType } from '../types'

interface INotificationFilterProps {
  options: OptionProps[]
  onOptionChange: (option: OptionProps) => void
  description: string
  width?: string
}

interface ISettingsModalProps {
  activeSubscriptions: NotifyClientTypes.NotifySubscription[]
  currentSubscription: NotifyClientTypes.NotifySubscription | null
  pushClient: PushClient
}

const NotificationFilter = ({ options, onOptionChange, width, description }: INotificationFilterProps) => {
  return (
    <FilterContainer>
      <LabelWrapper style={{ width: `${width}` }}>
        <Text textTransform="uppercase" mb="4px" ml="4px">
          {description}
        </Text>
        <Select onOptionChange={onOptionChange} options={options} />
      </LabelWrapper>
    </FilterContainer>
  )
}
const SettingsModal = ({ activeSubscriptions, currentSubscription, pushClient }: ISettingsModalProps) => {
  const [sortOptionsType, setSortOptionsType] = useState<string>('Latest')
  const [notificationType, setNotificationType] = useState<string>('All')
  const [notifications, setNotifications] = useState<NotifyClientTypes.NotifyMessageRecord[]>([])

  const { t } = useTranslation()

  const updateMessages = useCallback(async () => {
    if (currentSubscription?.topic) {
      try {
        const messageHistory = await pushClient.getMessageHistory({ topic: currentSubscription?.topic })
        setNotifications(Object.values(messageHistory))
      } catch (error) {
        console.error(error)
        throw new Error(JSON.stringify(error))
      }
    }
  }, [setNotifications, pushClient, currentSubscription?.topic])

  const handleNotifyOptionChange = useCallback((option: OptionProps) => {
    setNotificationType(option.value)
  }, [])

  const handleSortOptionChange = useCallback((option: OptionProps) => {
    setSortOptionsType(option.value)
  }, [])

  const removeNotification = useCallback(
    async (id: number) => {
      await pushClient.deleteNotifyMessage({ id: Number(id) }).then(() => updateMessages())
    },
    [updateMessages, pushClient],
  )

  const removeAllNotifications = useCallback(async () => {
    notifications.forEach((notification) => {
      removeNotification(notification.id)
    })
  }, [notifications, removeNotification])

  const filteredNotifications: any = useMemo(() => {
    const typeFilter = (
      subscriptionType: SubsctiptionType,
      unFilteredNotifications: NotifyClientTypes.NotifyMessageRecord[],
    ) => {
      return unFilteredNotifications.filter((notification: NotifyClientTypes.NotifyMessageRecord) => {
        const extractedType = notification.message.type
        return extractedType === subscriptionType
      })
    }
    const sortNotifications = (unFilteredNotifications: NotifyClientTypes.NotifyMessageRecord[]): any[] => {
      switch (notificationType) {
        case SubsctiptionType.Liquidity:
          return typeFilter(SubsctiptionType.Liquidity, unFilteredNotifications)
        case SubsctiptionType.Staking:
          return typeFilter(SubsctiptionType.Staking, unFilteredNotifications)
        case SubsctiptionType.Pools:
          return typeFilter(SubsctiptionType.Pools, unFilteredNotifications)
        case SubsctiptionType.Farms:
          return typeFilter(SubsctiptionType.Farms, unFilteredNotifications)
        case SubsctiptionType.Alerts:
          return typeFilter(SubsctiptionType.Alerts, unFilteredNotifications)
        default:
          return notifications
      }
    }
    return sortNotifications(notifications)
  }, [notifications, notificationType])

  useEffect(() => {
    if (!currentSubscription?.topic) return
    updateMessages()
  }, [updateMessages, currentSubscription?.topic, activeSubscriptions])

  useEffect(() => {
    if (!(pushClient && currentSubscription?.topic)) {
      return () => null
    }

    pushClient.emitter.on('notify_message', () => updateMessages())
    pushClient.emitter.on('notify_message', () => updateMessages())

    return () => {
      pushClient.emitter.off('notify_message', () => updateMessages())
      pushClient.emitter.off('notify_message', () => updateMessages())
    }
  }, [pushClient, setNotifications, currentSubscription?.topic, updateMessages])

  return (
    <Box paddingBottom="24px" width="100%">
      <Flex alignItems="center" justifyContent="space-between" paddingX="24px" marginBottom="16px">
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
        <Button marginTop="20px" height="40px" maxWidth="95px" variant="primary" onClick={removeAllNotifications}>
          <Text px="4px" fontWeight="bold" color="white">
            {t('Clear')}
          </Text>
        </Button>
      </Flex>
      <Box minHeight="360px" overflowY="scroll">
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
