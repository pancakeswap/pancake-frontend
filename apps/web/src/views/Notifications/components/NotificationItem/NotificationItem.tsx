import { useTranslation } from '@pancakeswap/localization'
import { Box, ChevronDownIcon, ChevronUpIcon, Flex, FlexGap, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { useNotificationTypes } from '@web3inbox/react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useHasUnreadNotification } from 'state/notifications/hooks'
import useNotificationHistory from 'views/Notifications/hooks/useNotificationHistory'
import {
  ContentsContainer,
  Description,
  Dot,
  ExpandButton,
  NoNotificationsWrapper,
  NotificationsWrapper,
  StyledLink,
  StyledNotificationWrapper,
} from 'views/Notifications/styles'
import { SubsctiptionType } from 'views/Notifications/types'
import { formatTime } from 'views/Notifications/utils/date'
import { getLinkText } from 'views/Notifications/utils/textHelpers'
import { NotificationBadge, NotificationImage, formatStringWithNewlines } from './NotificationItemImage'

interface INotificationprops {
  title: string
  description: string
  date: number
  url: string | null
  id: string
  subscriptionId: string
  type: SubsctiptionType
  image?: string | undefined
}

interface INotificationContainerProps {
  notifications: NotifyClientTypes.NotifyNotification[]
  subscriptionId: string
  importantAlertsOnly: boolean
}

const NotificationItem = ({ title, description, date, image, url, subscriptionId, id, type }: INotificationprops) => {
  const [show, setShow] = useState<boolean>(false)
  const [elementHeight, setElementHeight] = useState<number>(0)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const contentRef = useRef<HTMLDivElement>(null)
  const hasUnread = useHasUnreadNotification(subscriptionId, id)
  const { markAsRead } = useNotificationHistory(subscriptionId)

  const formattedDate = formatTime(Math.floor(date / 1000).toString())
  const formatedDescription = formatStringWithNewlines(description, isMobile)
  const linkText = getLinkText(type, t)

  const handleExpandClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement
      if (target.tagName !== 'BUTTON') setShow(!show)
    },
    [show],
  )

  useEffect(() => {
    if (contentRef.current) setElementHeight(contentRef.current.scrollHeight)
    if (!hasUnread) markAsRead(false, id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StyledNotificationWrapper
      onClick={handleExpandClick}
      onMouseEnter={() => {
        if (hasUnread) return
        markAsRead(true, id)
      }}
    >
      <ContentsContainer>
        <Flex flexDirection="column" width="100%">
          <Flex justifyContent="space-between" width="100%">
            <NotificationImage image={image} message={description} type={type} />
            <Flex flexDirection="column" width="100%">
              <Text fontWeight={600} marginBottom="2px">
                {title}
              </Text>
              <FlexGap alignItems="center" gap="6px" width="100%">
                {!hasUnread && <Dot show color="success" className="dot" />}
                <Text fontSize="13px" color="textSubtle">
                  {formattedDate}
                </Text>
                <NotificationBadge message={description} type={type} />
              </FlexGap>
            </Flex>
            {url ? (
              <Flex alignItems="flex-start">
                {!isMobile && (
                  <Text color="primary" fontWeight={600} fontSize="14px">
                    {show ? t('LESS') : t('MORE')}
                  </Text>
                )}
                <ExpandButton>
                  {show ? <ChevronUpIcon color="primary" /> : <ChevronDownIcon color="primary" />}
                </ExpandButton>
              </Flex>
            ) : null}
          </Flex>
          <Description ref={contentRef} show={show} elementHeight={elementHeight}>
            <Text>{formatedDescription}</Text>
            {url && url !== '' && (
              <StyledLink href={url} target="_blank">
                {linkText}
              </StyledLink>
            )}
          </Description>
        </Flex>
      </ContentsContainer>
    </StyledNotificationWrapper>
  )
}

const NotificationContainer = ({ notifications, subscriptionId, importantAlertsOnly }: INotificationContainerProps) => {
  const { t } = useTranslation()
  const { data: types } = useNotificationTypes()

  if (notifications.length === 0) {
    return (
      <NoNotificationsWrapper>
        <Box paddingY="82px" marginY="18px" height="100%">
          <FlexGap
            paddingX="26px"
            rowGap="8px"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            opacity={0.6}
          >
            <Box minHeight="122px" paddingRight="10px">
              <Image src="/images/notifications/notifications-empty.png" alt="#" height={100} width={100} />
            </Box>
            <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
              {t('Empty')}
            </Text>
            <Text fontSize="16px" textAlign="center" color="textSubtle">
              {t('No new notifications at the moment')}
            </Text>
          </FlexGap>
        </Box>
      </NoNotificationsWrapper>
    )
  }
  return (
    <NotificationsWrapper>
      {notifications
        .sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1))
        .filter((notification: NotifyClientTypes.NotifyNotification) => {
          if (importantAlertsOnly)
            return notification.type === SubsctiptionType.Alerts || notification.type === SubsctiptionType.Liquidity
          return true
        })
        .map((notification: NotifyClientTypes.NotifyNotification) => {
          return (
            <NotificationItem
              key={notification.id}
              title={notification.title}
              description={notification.body}
              date={notification.sentAt}
              url={notification.url}
              image={types?.[notification.type]?.imageUrls.md}
              id={notification.id}
              subscriptionId={subscriptionId}
              type={notification.type as SubsctiptionType}
            />
          )
        })}
    </NotificationsWrapper>
  )
}

export default NotificationContainer
