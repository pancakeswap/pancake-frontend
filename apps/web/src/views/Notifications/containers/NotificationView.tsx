import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  CloseIcon,
  CogIcon,
  Flex,
  IconButton,
  InfoFilledIcon,
  OptionProps,
  Select,
  Text,
  Toggle,
  TooltipText,
  useMatchBreakpoints,
  useTooltip,
} from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { useMessages, useSubscription } from '@web3inbox/widget-react'
import React, { useCallback, useMemo, useState } from 'react'
import { addArchivedNotification, setHasUnread, setImportantAlerts } from 'state/notifications/actions'
import { useAllNotifications, useImportantNotificationsOnly } from 'state/notifications/hooks'
import { styled } from 'styled-components'
import { NotificationFilterTypes } from 'views/Notifications/constants'
import { NotificationContainerStyled } from 'views/Notifications/styles'
import { useNotificationsState } from 'state/notifications/reducer'
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
  const [, dispatch] = useNotificationsState()
  const { isMobile } = useMatchBreakpoints()
  const mobileHeight = window?.innerHeight

  const { messages: notifications, deleteMessage } = useMessages(account)
  const { subscription } = useSubscription(account)
  const archivedNotifications = useAllNotifications(subscription?.topic)
  const importantAlertsOnly = useImportantNotificationsOnly(subscription?.topic)
  const { t } = useTranslation()

  const handleNotifyOptionChange = useCallback((option: OptionProps) => {
    if (option.value === 'Archived') setViewMode(ViewMode.Archived)
    if (option.value === 'All') setViewMode(ViewMode.Latest)
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
    const typeFilterLP = (
      subscriptionType: SubsctiptionType,
      unFilteredNotifications: NotifyClientTypes.NotifyMessageRecord[],
    ) => {
      return unFilteredNotifications.filter((notification: NotifyClientTypes.NotifyMessageRecord) => {
        const extractedType = [notification.message.type, SubsctiptionType.Liquidity]
        return extractedType.includes(subscriptionType)
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
          return typeFilterLP(SubsctiptionType.Alerts, unFilteredNotifications)
        case SubsctiptionType.TradingReward:
          return typeFilter(SubsctiptionType.TradingReward, unFilteredNotifications)
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
      dispatch(setHasUnread({ subscriptionId: subscription.topic, notificationId: notification.id, hasUnread: true }))
    }
    const deletePromises = notifications
      .filter((notification) => filteredNotifications.active.includes(notification))
      .map((notification) => deleteMessage(notification.id))

    await Promise.all(deletePromises)
    setIsClosing(false)
  }, [notifications, deleteMessage, dispatch, subscription?.topic, filteredNotifications])

  const toggleImportantOnlyAlerts = useCallback(async () => {
    if (!subscription?.topic) return
    dispatch(setImportantAlerts({ subscriptionId: subscription?.topic, importantOnly: !importantAlertsOnly }))
  }, [importantAlertsOnly, subscription?.topic, dispatch])

  const {
    tooltip: importantAlertsTooltip,
    tooltipVisible: importantAlertsTooltipVisible,
    targetRef: buyCryptoTargetRef,
  } = useTooltip(
    <Box maxWidth="160px">
      <Text as="p">{t('Show only the notifications that belong to your wallet or LP positions')}</Text>
    </Box>,
    {
      isInPortal: false,
      placement: isMobile ? 'top' : 'bottom',
      trigger: isMobile ? 'focus' : 'hover',
    },
  )

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
            <CloseIcon color="primary" />
          </IconButton>
        }
        text={t('Notifications')}
      />
      <Flex alignItems="center" justifyContent="space-between" paddingBottom="8px" paddingTop="4px" paddingX="22px">
        <Box width="125px">
          <Select
            onOptionChange={handleNotifyOptionChange}
            options={NotificationFilterTypes.filter((option) => {
              if (!isMobile) return option.label !== 'Archived'
              return option
            })}
          />
        </Box>
        {!isMobile && <NotificationsTabButton activeIndex={viewMode} setActiveIndex={setViewMode} />}
      </Flex>
      <Flex paddingX="24px" alignItems="center" paddingTop="10px" paddingBottom="16px">
        <Toggle
          id="toggle-expert-mode-button"
          scale="sm"
          checked={importantAlertsOnly}
          onChange={toggleImportantOnlyAlerts}
        />
        <Text paddingX="8px">{t('Important only')}</Text>
        <TooltipText ref={buyCryptoTargetRef} display="flex" style={{ justifyContent: 'center' }}>
          <InfoFilledIcon pt="2px" fill="#000" color="textSubtle" width="16px" />
        </TooltipText>

        {importantAlertsTooltipVisible && !isMobile && importantAlertsTooltip}
      </Flex>
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

      <NotificationContainerStyled
        $maxHeight={viewMode === ViewMode.Archived ? '400px' : isMobile ? `${mobileHeight - 250}px` : '450px'}
      >
        {subscription?.topic && (
          <NotificationItem
            notifications={
              viewMode === ViewMode.Latest
                ? importantAlertsOnly
                  ? notifications
                  : filteredNotifications.active
                : filteredNotifications.archived
            }
            isClosing={isClosing}
            subscriptionId={subscription.topic}
            importantAlertsOnly={importantAlertsOnly}
          />
        )}
      </NotificationContainerStyled>
      <Flex padding="20px" paddingY="18px" width="100%" alignItems="flex-end" justifyContent="flex-end">
        {notifications.length > 0 && viewMode === ViewMode.Latest ? (
          <Button variant="secondary" width="100%" onClick={removeAllNotifications}>
            {t('Archive all read')}
          </Button>
        ) : null}
      </Flex>
    </Box>
  )
}

export default NotificationView
