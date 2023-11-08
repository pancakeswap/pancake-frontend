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
import { useMessages, useSubscription } from '@web3inbox/widget-react'
import React, { useCallback, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import { addArchivedNotification } from 'state/notifications/actions'
import { useAllNotifications } from 'state/notifications/hooks'
import { styled } from 'styled-components'
import { NotificationFilterTypes } from 'views/Notifications/constants'
import { NotificationContainerStyled } from 'views/Notifications/styles'
import { useAccount } from 'wagmi'
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
}: {
  toggleSettings: (e: React.MouseEvent<HTMLButtonElement>) => void
  onDismiss: () => void
}) => {
  const [notificationType, setNotificationType] = useState<string>('All')
  const [isClosing, setIsClosing] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Latest)
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const { messages: notifications, deleteMessage } = useMessages(`eip155:1:${account}`)
  const { subscription } = useSubscription(`eip155:1:${account}`)
  const archivedNotifications = useAllNotifications(subscription?.topic)

  const { t } = useTranslation()

  const handleNotifyOptionChange = useCallback((option: OptionProps) => {
    setNotificationType(option.value)
  }, [])

  const removeAllNotifications = useCallback(async () => {
    if (!subscription?.topic) return
    setIsClosing(true)
    const deletePromises = notifications.map((notification) => {
      return Promise.all([
        dispatch(
          addArchivedNotification({
            timestamp: Date.now() / 1000,
            notification,
            subscriptionId: subscription.topic,
            notificationId: notification.id.toString(),
          }),
        ),
        deleteMessage(notification.id),
      ])
    })

    setTimeout(async () => {
      await Promise.all(deletePromises)
      setIsClosing(false)
    }, 400)
  }, [notifications, deleteMessage, dispatch, subscription?.topic])

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
        case SubsctiptionType.Farms:
          return typeFilter(SubsctiptionType.Farms, unFilteredNotifications)
        case SubsctiptionType.PriceUpdates:
          return typeFilter(SubsctiptionType.PriceUpdates, unFilteredNotifications)
        case SubsctiptionType.Promotional:
          return typeFilter(SubsctiptionType.Promotional, unFilteredNotifications)
        case SubsctiptionType.Alerts:
          return typeFilter(SubsctiptionType.Alerts, unFilteredNotifications)
        default:
          return notifications
      }
    }
    return sortNotifications(notifications)
  }, [notifications, notificationType])

  return (
    <Box width="100%">
      <NotificationHeader
        leftIcon={
          <IconButton tabIndex={-1} variant="text" onClick={onDismiss}>
            <ModalCloseButton onDismiss={onDismiss} />
          </IconButton>
        }
        rightIcon={
          <IconButton tabIndex={-1} variant="text" onClick={toggleSettings}>
            <CogIcon color="primary" />
          </IconButton>
        }
        text={t('Notifications')}
      />
      <Flex alignItems="center" justifyContent="space-between" paddingBottom="8px" paddingTop="4px" paddingX="22px">
        <Box width="125px">
          <Select onOptionChange={handleNotifyOptionChange} options={NotificationFilterTypes} />
        </Box>
        <NotificationsTabButton activeIndex={viewMode} setActiveIndex={setViewMode} />
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

      <NotificationContainerStyled maxHeight={viewMode === ViewMode.Archived ? '350px' : '400px'}>
        <NotificationItem
          notifications={viewMode === ViewMode.Latest ? filteredNotifications : archivedNotifications}
          isClosing={isClosing}
        />
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
