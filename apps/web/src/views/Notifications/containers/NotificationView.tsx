import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  CogIcon,
  Flex,
  IconButton,
  ModalCloseButton,
  OptionProps,
  Select,
  Text,
} from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { useMessages, useSubscription, useSubscriptionScopes } from '@web3inbox/widget-react'
import React, { useCallback, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import { addArchivedNotification } from 'state/notifications/actions'
import { useAllNotifications } from 'state/notifications/hooks'
import { styled } from 'styled-components'
import { NotificationFilterTypes } from 'views/Notifications/constants'
import { NotificationContainerStyled } from 'views/Notifications/styles'
import { NotificationHeader } from '../components/NotificationHeader/NotificationHeader'
import NotificationItem from '../components/NotificationItem/NotificationItem'
import { SubsctiptionType } from '../types'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
enum ViewMode {
  Latest = 0,
  Archived = 1,
}
interface FarmTabButtonsProps {
  activeIndex: ViewMode
  setActiveIndex: React.Dispatch<React.SetStateAction<ViewMode>>
}

export const NotificationsTabButton: React.FC<React.PropsWithChildren<FarmTabButtonsProps>> = ({
  activeIndex,
  setActiveIndex,
}) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Flex width="max-content" flexDirection="column">
        <ButtonMenu
          activeIndex={activeIndex}
          onItemClick={(index, e) => {
            e.stopPropagation()
            setActiveIndex(index)
          }}
          scale="sm"
          variant="subtle"
        >
          <ButtonMenuItem>{t('Latest')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Archived')}</ButtonMenuItem>
        </ButtonMenu>
      </Flex>
    </Wrapper>
  )
}

const NotificationView = ({
  toggleSettings,
  onDismiss,
  account,
}: {
  toggleSettings: (e: React.MouseEvent<HTMLButtonElement>) => void
  onDismiss: () => void
  account: string
}) => {
  const [notificationType, setNotificationType] = useState<string>('All')
  const [isClosing, setIsClosing] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Latest)
  const dispatch = useAppDispatch()
  const { messages: notifications, deleteMessage } = useMessages(account)
  const { scopes: currentScopes, updateScopes } = useSubscriptionScopes(account)
  const [scopes, setScopes] = useState<NotifyClientTypes.ScopeMap>(currentScopes)
  const { subscription } = useSubscription(account)
  const archivedNotifications = useAllNotifications(subscription?.topic)

  const { t } = useTranslation()

  const handleNotifyOptionChange = useCallback((option: OptionProps) => {
    setNotificationType(option.value)
  }, [])

  const filteredNotifications = useMemo(() => {
    const typeFilter = (
      subscriptionType: SubsctiptionType,
      unFilteredNotifications: NotifyClientTypes.NotifyMessageRecord[],
    ) => {
      return unFilteredNotifications.filter((notification: NotifyClientTypes.NotifyMessageRecord) => {
        const extractedType = notification.message.type
        return extractedType === subscriptionType
      })
    }
    const sortNotifications = (unFilteredNotifications: NotifyClientTypes.NotifyMessageRecord[]) => {
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
          return typeFilter(SubsctiptionType.Alerts, unFilteredNotifications)
        default:
          return unFilteredNotifications
      }
    }
    const active = sortNotifications(notifications)
    const archived = sortNotifications(archivedNotifications)

    return { active, archived }
  }, [notifications, notificationType, archivedNotifications])

  const removeAllNotifications = useCallback(async () => {
    if (!subscription?.topic) return

    for (const notification of notifications) {
      if (!filteredNotifications.active.includes(notification)) continue
      dispatch(
        addArchivedNotification({
          timestamp: Date.now() / 1000,
          notification,
          subscriptionId: subscription.topic,
          notificationId: notification.id.toString(),
        }),
      )
    }
    const deletePromises = notifications
      .filter((notification) => filteredNotifications.active.includes(notification))
      .map((notification) => deleteMessage(notification.id))

    await Promise.all(deletePromises)
    setIsClosing(false)
  }, [notifications, deleteMessage, dispatch, subscription?.topic, filteredNotifications])

  return (
    <Box width="100%">
      <NotificationHeader
        leftIcon={
          <IconButton tabIndex={-1} variant="text" onClick={toggleSettings}>
            <CogIcon color="primary" />
          </IconButton>
        }
        rightIcon={
          <IconButton tabIndex={-1} variant="text" onClick={onDismiss}>
            <ModalCloseButton onDismiss={onDismiss} />
          </IconButton>
        }
        text={t('Notifications')}
      />
      <Flex alignItems="center" justifyContent="space-between" paddingBottom="8px" paddingTop="4px" paddingX="22px">
        <Box width="125px">
          <Select
            onOptionChange={handleNotifyOptionChange}
            options={NotificationFilterTypes.sort((a, b) => {
              if (a.label === 'Alerts') return -1
              if (b.label === 'Alerts') return 1
              return 0
            }).map((type) => type)}
          />
        </Box>
        <NotificationsTabButton activeIndex={viewMode} setActiveIndex={setViewMode} />
      </Flex>
      {/* <Flex paddingX="24px" alignItems="center" paddingY="12px">
        {scopes && (
          <Toggle
            id="toggle-expert-mode-button"
            scale="sm"
            checked={scopes['81be3ea1-c562-433d-9dfe-d709ce7d3719']?.enabled}
            onChange={toggleScopeEnabled}
          />
        )}
        <Text paddingX="8px">{t('Important only')}</Text>
        <InfoIcon width="16px" height="16px" color="textSubtle" paddingTop="2px" />
      </Flex> */}
      {viewMode === ViewMode.Archived ? (
        <>
          <Flex justifyContent="center" pt="12px" pb="16px" borderBottom="1px solid" borderBottomColor="cardBorder">
            <Text color="textSubtle">{t('All archived messages will be deleted in 24hr')}</Text>
          </Flex>
          <Flex justifyContent="center" pt="16px">
            <Text color="textDisabled">{t('ARCHIVED MESSAGES')}</Text>
          </Flex>
        </>
      ) : null}

      <NotificationContainerStyled maxHeight={viewMode === ViewMode.Archived ? '350px' : '450px'}>
        {subscription?.topic && (
          <NotificationItem
            notifications={viewMode === ViewMode.Latest ? filteredNotifications.active : filteredNotifications.archived}
            isClosing={isClosing}
            subscriptionId={subscription.topic}
          />
        )}
      </NotificationContainerStyled>
      <Flex padding="20px" paddingY="18px" width="100%" alignItems="flex-end" justifyContent="flex-end">
        {notifications.length > 0 && viewMode === ViewMode.Latest ? (
          <Button variant="secondary" width="100%" height="42px" onClick={removeAllNotifications}>
            {t('Archive all read')}
          </Button>
        ) : null}
      </Flex>
    </Box>
  )
}

export default NotificationView
