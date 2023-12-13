import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Flex,
  FlexGap,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch } from 'state'
import { setHasUnread } from 'state/notifications/actions'
import { useHasUnreadNotification } from 'state/notifications/hooks'
import { CHAIN_NAME_TO_CHAIN_ID } from 'views/Notifications/constants'
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
import {
  extractChainIdFromMessage,
  extractPercentageFromString,
  extractWordBeforeFullStop,
  getBadgeString,
  getLinkText,
  hasSingleFarm,
} from 'views/Notifications/utils/textHelpers'
import AlertIcon from '../../../../../public/images/notifications/alert-icon.svg'

interface INotificationprops {
  title: string
  description: string
  date: number
  url: string
  id: number
  subscriptionId: string
  image?: string | undefined
}

interface INotificationContainerProps {
  notifications: NotifyClientTypes.NotifyMessageRecord[]
  isClosing: boolean
  subscriptionId: string
  importantAlertsOnly: boolean
}

const getNotificationPairlogo = (title: string, message: string) => {
  const isAprNotification = title.includes('APR')
  const chainName = isAprNotification ? extractWordBeforeFullStop(message) : extractChainIdFromMessage(message)
  const chainId = CHAIN_NAME_TO_CHAIN_ID[chainName === 'polygon_zkevm.' ? 'polygon_zkevm' : chainName]

  const image1 = isAprNotification ? '/images/notifications/farms-scope.svg' : '/logo.png'
  const image2 = `${ASSET_CDN}/web/chains/${chainId}.png`

  return { image1, image2 }
}
const NotificationImage = ({
  image,
  title,
  message,
}: {
  image: string | undefined
  title: string
  message: string
}) => {
  if (title.includes('APR Update') || title.includes('LP position')) {
    const { image1, image2 } = getNotificationPairlogo(title, message)
    const hasOnlyOneItem = hasSingleFarm(message)
    if (hasOnlyOneItem) {
      return (
        <Box marginRight="8px" paddingY="4px" minWidth="40px">
          <Image src={image2} alt="apr Image" height={40} width={40} unoptimized />
        </Box>
      )
    }
    return (
      <Box position="relative" minWidth="40px" minHeight="40px">
        <Box marginRight="8px" position="absolute" top={0} left={0}>
          <Image src={image1} alt="apr img" height={30} width={30} unoptimized />
        </Box>
        <Box marginRight="8px" position="absolute" bottom={0} right={0}>
          <Image src={image2} alt="apr img" height={26} width={26} unoptimized />
        </Box>
      </Box>
    )
  }
  return (
    <Box marginRight="8px" paddingY="4px" minWidth="40px">
      <Image src={image?.toString() ?? '/logo.png'} alt="Notification Image" height={40} width={40} unoptimized />
    </Box>
  )
}

const NotificationBadge = ({ title, message }: { title: string; message: string }) => {
  const { t } = useTranslation()
  if (title.includes('Balance')) {
    return (
      <FlexGap borderRadius={16} backgroundColor="tertiary" paddingY="2px" paddingX="6px" alignItems="center" gap="2px">
        <Image src={AlertIcon} alt="Alert Image" height={16} width={16} unoptimized />
        <Text fontSize="12px">{t('Alerts')}</Text>
      </FlexGap>
    )
  }
  if (title.includes('Price Movement') || title.includes('APR Update')) {
    const percentageChange = extractPercentageFromString(message)
    const hasFallen = message.includes('fallen')
    const isAPR = title.includes('APR')
    const badgeString = getBadgeString(isAPR, hasFallen, percentageChange ?? 0.0)

    return (
      <FlexGap borderRadius={16} backgroundColor="tertiary" paddingY="2px" paddingX="6px" alignItems="center" gap="2px">
        {hasFallen ? <ArrowDropDownIcon color="text" /> : <ArrowDropUpIcon color="text" />}
        <Text fontSize="12px" pr="6px" color="text">
          {badgeString}
        </Text>
      </FlexGap>
    )
  }
  return <></>
}

const formatStringWithNewlines = (inputString: string, isMobile: boolean) => {
  return inputString.split('\n').map((line: string, index: number) => (
    <Text
      // eslint-disable-next-line react/no-array-index-key
      key={`message-line-${index}`}
      fontSize={isMobile ? '14px' : '16px'}
      lineHeight="20px"
      fontWeight={400}
      color="textSubtle"
    >
      {line}
    </Text>
  ))
}

const NotificationItem = ({ title, description, date, image, url, subscriptionId, id }: INotificationprops) => {
  const [show, setShow] = useState<boolean>(false)
  const [elementHeight, setElementHeight] = useState<number>(0)
  const dispatch = useAppDispatch()
  const { isMobile } = useMatchBreakpoints()

  const hasUnread = useHasUnreadNotification(subscriptionId, id)
  const formattedDate = formatTime(Math.floor(date / 1000).toString())
  const containerRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const formatedDescription = formatStringWithNewlines(description, isMobile)
  const linkText = getLinkText(title, t)

  const handleExpandClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement
      if (target.tagName !== 'BUTTON') setShow(!show)
    },
    [show],
  )

  useEffect(() => {
    if (contentRef.current) setElementHeight(contentRef.current.scrollHeight)
    if (!hasUnread) dispatch(setHasUnread({ subscriptionId, notificationId: id, hasUnread: false }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StyledNotificationWrapper
      ref={containerRef}
      onClick={handleExpandClick}
      onMouseEnter={() => dispatch(setHasUnread({ subscriptionId, notificationId: id, hasUnread: true }))}
    >
      <ContentsContainer>
        <Flex flexDirection="column" width="100%">
          <Flex justifyContent="space-between" width="100%">
            <NotificationImage image={image} title={title} message={description} />
            <Flex flexDirection="column" width="100%">
              <Text fontWeight={600} marginBottom="2px">
                {title.includes('Update POLYGON_ZKEVM') ? 'Farms APR Update ZKEVM' : title}
              </Text>
              <FlexGap alignItems="center" gap="6px" width="100%">
                {!hasUnread && <Dot show color="success" className="dot" />}
                <Text fontSize="13px" color="textSubtle">
                  {formattedDate}
                </Text>
                <NotificationBadge title={title} message={description} />
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
            {url !== '' && (
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

const NotificationContainer = ({
  notifications,
  isClosing,
  subscriptionId,
  importantAlertsOnly,
}: INotificationContainerProps) => {
  const { t } = useTranslation()
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
    <NotificationsWrapper isClosing={isClosing}>
      {notifications
        .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
        .filter((notification: NotifyClientTypes.NotifyMessageRecord) => {
          if (importantAlertsOnly)
            return (
              notification.message.type === SubsctiptionType.Alerts ||
              notification.message.type === SubsctiptionType.Liquidity
            )
          return true
        })
        .map((notification: NotifyClientTypes.NotifyMessageRecord) => {
          return (
            <NotificationItem
              key={notification.id}
              title={notification.message.title}
              description={notification.message.body}
              date={notification.publishedAt}
              url={notification.message.url}
              image={notification.message.icon}
              id={notification.id}
              subscriptionId={subscriptionId}
            />
          )
        })}
    </NotificationsWrapper>
  )
}

export default NotificationContainer
