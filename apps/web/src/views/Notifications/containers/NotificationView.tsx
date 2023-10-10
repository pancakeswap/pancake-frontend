import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, FlexGap, OptionProps, Select, Text } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { useMessages } from '@web3inbox/widget-react'
import Image from 'next/image'
import { useCallback, useMemo, useState } from 'react'
import { NotificationFilterTypes, NotificationSortTypes } from 'views/Notifications/constants'
import { FilterContainer, LabelWrapper, NotificationContainerStyled } from 'views/Notifications/styles'
import NotificationItem from '../components/NotificationItem/NotificationItem'
import { SubsctiptionType } from '../types'

interface INotificationFilterProps {
  options: OptionProps[]
  onOptionChange: (option: OptionProps) => void
  description: string
}

const NotificationFilter = ({ options, onOptionChange, description }: INotificationFilterProps) => {
  return (
    <FilterContainer>
      <LabelWrapper>
        <Text textTransform="uppercase" mb="4px" ml="4px">
          {description}
        </Text>
        <Select onOptionChange={onOptionChange} options={options} />
      </LabelWrapper>
    </FilterContainer>
  )
}

const NoNotificationsView = () => {
  const { t } = useTranslation()
  return (
    <>
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
    </>
  )
}

const SettingsModal = ({ account }: { account: string | undefined }) => {
  const [sortOptionsType, setSortOptionsType] = useState<string>('Latest')
  const [notificationType, setNotificationType] = useState<string>('All')
  const { messages: notifications, deleteMessage } = useMessages(account)
  const { t } = useTranslation()

  const handleNotifyOptionChange = useCallback((option: OptionProps) => {
    setNotificationType(option.value)
  }, [])

  const handleSortOptionChange = useCallback((option: OptionProps) => {
    setSortOptionsType(option.value)
  }, [])

  const removeAllNotifications = useCallback(async () => {
    notifications.forEach((notification) => {
      deleteMessage(notification.id)
    })
  }, [notifications, deleteMessage])

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
        case SubsctiptionType.Lottery:
          return typeFilter(SubsctiptionType.Lottery, unFilteredNotifications)
        case SubsctiptionType.Prediction:
          return typeFilter(SubsctiptionType.Prediction, unFilteredNotifications)
        case SubsctiptionType.Liquidity:
          return typeFilter(SubsctiptionType.Liquidity, unFilteredNotifications)
        case SubsctiptionType.Staking:
          return typeFilter(SubsctiptionType.Staking, unFilteredNotifications)
        case SubsctiptionType.Pools:
          return typeFilter(SubsctiptionType.Pools, unFilteredNotifications)
        case SubsctiptionType.Farms:
          return typeFilter(SubsctiptionType.Farms, unFilteredNotifications)
        case SubsctiptionType.PriceUpdates:
          return typeFilter(SubsctiptionType.PriceUpdates, unFilteredNotifications)
        case SubsctiptionType.Promotional:
          return typeFilter(SubsctiptionType.Promotional, unFilteredNotifications)
        case SubsctiptionType.Voting:
          return typeFilter(SubsctiptionType.Voting, unFilteredNotifications)
        case SubsctiptionType.Alerts:
          return typeFilter(SubsctiptionType.Alerts, unFilteredNotifications)
        default:
          return notifications
      }
    }
    return sortNotifications(notifications)
  }, [notifications, notificationType])

  return (
    <Box paddingBottom="24px" width="100%">
      <Flex alignItems="center" justifyContent="space-between" paddingX="24px" marginBottom="16px">
        <NotificationFilter
          onOptionChange={handleNotifyOptionChange}
          options={NotificationFilterTypes}
          description="Filter By Type"
        />
        <NotificationFilter
          onOptionChange={handleSortOptionChange}
          options={NotificationSortTypes}
          description="Sort By Date"
        />
        <Button marginTop="20px" height="40px" maxWidth="95px" variant="primary" onClick={removeAllNotifications}>
          <Text px="4px" fontWeight="bold" color="white">
            {t('Clear')}
          </Text>
        </Button>
      </Flex>
      <Box minHeight="360px" overflowY="scroll">
        <NotificationContainerStyled>
          {filteredNotifications.length > 0 ? (
            <NotificationItem
              notifications={filteredNotifications}
              sortOptionsType={sortOptionsType}
              removeNotification={deleteMessage}
            />
          ) : (
            <NoNotificationsView />
          )}
        </NotificationContainerStyled>
      </Box>
    </Box>
  )
}

export default SettingsModal
