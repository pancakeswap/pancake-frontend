import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  CircleLoader,
  CogIcon,
  Flex,
  IconButton,
  OptionProps,
  QuestionHelper,
  Select,
  Text,
  Toggle,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'

import React, { useCallback, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import { setImportantAlerts } from 'state/notifications/actions'
import { useImportantNotificationsOnly } from 'state/notifications/hooks'
import { NotificationFilterTypes } from 'views/Notifications/constants'
import { NotificationContainerStyled } from 'views/Notifications/styles'
import { NotificationHeader } from '../components/NotificationHeader/NotificationHeader'
import NotificationItem from '../components/NotificationItem/NotificationItem'
import useNotificationHistory from '../hooks/useNotificationHistory'
import { SubsctiptionType } from '../types'

const NotificationView = ({
  toggleSettings,
  subscription,
}: {
  toggleSettings: (e: React.MouseEvent<HTMLButtonElement>) => void
  subscription: any
}) => {
  const [notificationType, setNotificationType] = useState<string>('All')

  const dispatch = useAppDispatch()
  const { isMobile } = useMatchBreakpoints()
  const mobileHeight = window?.innerHeight

  const { notifications, containerRef, isLoading } = useNotificationHistory(subscription?.topic)
  const importantAlertsOnly = useImportantNotificationsOnly(subscription?.topic)
  const { t } = useTranslation()

  const handleNotifyOptionChange = useCallback((option: OptionProps) => {
    setNotificationType(option.value)
  }, [])

  const filteredNotifications = useMemo(() => {
    const typeFilter = (
      subscriptionType: SubsctiptionType,
      unFilteredNotifications: NotifyClientTypes.NotifyNotification[],
    ) => {
      return unFilteredNotifications.filter((notification: NotifyClientTypes.NotifyNotification) => {
        const extractedType = notification.type
        return extractedType === subscriptionType
      })
    }
    const typeFilterLP = (
      subscriptionType: SubsctiptionType,
      unFilteredNotifications: NotifyClientTypes.NotifyNotification[],
    ) => {
      return unFilteredNotifications.filter((notification: NotifyClientTypes.NotifyNotification) => {
        const extractedType = [notification.type, SubsctiptionType.Liquidity]
        return extractedType.includes(subscriptionType)
      })
    }
    const sortNotifications = (unFilteredNotifications: NotifyClientTypes.NotifyNotification[] | null) => {
      if (!unFilteredNotifications) return []
      switch (notificationType) {
        case SubsctiptionType.Lottery:
          return typeFilter(SubsctiptionType.Lottery, unFilteredNotifications)
        case SubsctiptionType.Prediction:
          return typeFilter(SubsctiptionType.Prediction, unFilteredNotifications)
        case SubsctiptionType.Liquidity:
          return typeFilter(SubsctiptionType.Liquidity, unFilteredNotifications)
        case SubsctiptionType.Farms:
          return typeFilter(SubsctiptionType.Farms, unFilteredNotifications)
        case SubsctiptionType.PriceUpdates:
          return typeFilter(SubsctiptionType.PriceUpdates, unFilteredNotifications)
        case SubsctiptionType.Promotional:
          return typeFilter(SubsctiptionType.Promotional, unFilteredNotifications)
        case SubsctiptionType.Alerts:
          return typeFilterLP(SubsctiptionType.Alerts, unFilteredNotifications)
        case SubsctiptionType.TradingReward:
          return typeFilter(SubsctiptionType.TradingReward, unFilteredNotifications)
        default:
          return unFilteredNotifications
      }
    }
    const active = sortNotifications(notifications)

    return { active }
  }, [notifications, notificationType])

  const toggleImportantOnlyAlerts = useCallback(async () => {
    if (!subscription?.topic) return
    dispatch(setImportantAlerts({ subscriptionId: subscription?.topic, importantOnly: !importantAlertsOnly }))
  }, [importantAlertsOnly, subscription?.topic, dispatch])

  return (
    <Box width="100%">
      <NotificationHeader
        leftIcon={<IconButton tabIndex={-1} variant="text" />}
        rightIcon={
          <IconButton tabIndex={-1} variant="text" onClick={toggleSettings}>
            <CogIcon color="primary" />
          </IconButton>
        }
        text={t('Notifications')}
      />
      <Flex alignItems="center" justifyContent="space-between" paddingBottom="8px" paddingTop="4px" paddingX="22px">
        <Box width="125px">
          <Select
            onOptionChange={handleNotifyOptionChange}
            options={NotificationFilterTypes.filter((option) => {
              return option
            })}
          />
        </Box>
        <Flex pr="4px" alignItems="center" justifyContent="center">
          <Toggle
            id="toggle-expert-mode-button"
            scale="sm"
            checked={importantAlertsOnly}
            onChange={toggleImportantOnlyAlerts}
          />
          <Text paddingX="6px">{t('Important only')}</Text>
          <QuestionHelper
            text={t('Show only the notifications that belong to your wallet or LP positions')}
            color="textSubtle"
            size="16px"
            marginTop="2px"
          />
        </Flex>
      </Flex>

      <NotificationContainerStyled ref={containerRef} $maxHeight={isMobile ? `${mobileHeight - 250}px` : '545px'}>
        {notifications && subscription?.topic && (
          <NotificationItem
            notifications={importantAlertsOnly ? notifications : filteredNotifications.active}
            subscriptionId={subscription.topic}
            importantAlertsOnly={importantAlertsOnly}
          />
        )}
      </NotificationContainerStyled>
      <Flex padding="20px" paddingY="18px" width="100%" alignItems="center" justifyContent="center">
        {isLoading && <CircleLoader />}
      </Flex>
    </Box>
  )
}

export default NotificationView
