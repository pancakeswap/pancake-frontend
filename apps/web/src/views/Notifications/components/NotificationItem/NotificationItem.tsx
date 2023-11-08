import { useTranslation } from '@pancakeswap/localization'
import { ArrowDropDownIcon, Box, ChevronDownIcon, ChevronUpIcon, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
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
import { formatTime } from 'views/Notifications/utils/date'
import {
  extractPercentageFromString,
  extractTokensFromAPRString,
  removeTokensFromAPRString,
} from 'views/Notifications/utils/textHelpers'
import AlertIcon from '../../../../../public/images/notifications/alert-icon.svg'

interface INotificationprops {
  title: string
  description: string
  date: number
  url: string
  id: number
  image?: string | undefined
}

interface INotificationContainerProps {
  notifications: NotifyClientTypes.NotifyMessageRecord[]
  isClosing: boolean
}

const BottomRow = ({ show, elementHeight }: { show: boolean; elementHeight: number }) => {
  const { t } = useTranslation()
  return (
    <>
      {elementHeight > 35 ? (
        <Flex alignItems="flex-start">
          <ExpandButton color="primary" fontSize="14px" fontWeight={600}>
            {show ? t('LESS') : t('MORE')}
          </ExpandButton>
          <Flex alignItems="flex-start">
            {show ? <ChevronUpIcon color="primary" /> : <ChevronDownIcon color="primary" />}
          </Flex>
        </Flex>
      ) : null}
    </>
  )
}

const NotificationImage = ({ image, title, message }) => {
  if (title.includes('APR Update')) {
    const { token1, token2 } = extractTokensFromAPRString(message)
    return (
      <Box position="relative" minWidth="40px" minHeight="40px">
        <Box marginRight="8px" display="flex" paddingY="4px" position="absolute" top={0} left={0}>
          <Image
            src={`https://tokens.pancakeswap.finance/images/${token1}.png`}
            alt="Notification Image"
            height={22}
            width={23}
            unoptimized
          />
        </Box>
        <Box marginRight="8px" display="flex" paddingY="4px" position="absolute" bottom={0} right={0}>
          <Image
            src={`https://tokens.pancakeswap.finance/images/${token2}.png`}
            alt="Notification Image"
            height={27}
            width={27}
            unoptimized
          />
        </Box>
      </Box>
    )
  }
  return (
    <Box marginRight="8px" display="flex" paddingY="4px" minWidth="40px">
      <Image src={image?.toString() ?? '/logo.png'} alt="Notification Image" height={40} width={40} unoptimized />
    </Box>
  )
}

const NotificationBadge = ({ title, message }) => {
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
    return (
      <FlexGap borderRadius={16} backgroundColor="tertiary" paddingY="2px" paddingX="6px" alignItems="center" gap="2px">
        <ArrowDropDownIcon color="text" />
        <Text fontSize="12px">{`${isAPR ? 'APR' : ''} ${hasFallen ? 'Down' : 'Up'} ${percentageChange}%`}</Text>
      </FlexGap>
    )
  }
  return <></>
}

const formatStringWithNewlines = (inputString: string) => {
  const cleanStr = removeTokensFromAPRString(inputString)
  return cleanStr.split('\n').map((line: string, index: number) => (
    // eslint-disable-next-line react/no-array-index-key
    <Text key={`message-line-${index}`} lineHeight="20px" fontWeight={400} color="textSubtle">
      {line}
    </Text>
  ))
}

const NotificationItem = ({ title, description, date, image, url }: INotificationprops) => {
  const [show, setShow] = useState<boolean>(false)
  const [elementHeight, setElementHeight] = useState<number>(0)
  const formattedDate = formatTime(Math.floor(date / 1000).toString())
  const containerRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const formatedDescription = formatStringWithNewlines(description)

  const handleExpandClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement
      if (target.tagName !== 'BUTTON') setShow(!show)
    },
    [show],
  )
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getLinkText = (title: string) => {
    if (title.includes('APR Update')) return t('View Farm')
    if (title.includes('Balance')) return t('Buy Crypto')
    return t('View Link')
  }

  useEffect(() => {
    if (contentRef.current) setElementHeight(contentRef.current.scrollHeight)
  }, [])

  return (
    <StyledNotificationWrapper ref={containerRef} onClick={handleExpandClick}>
      <ContentsContainer>
        <Flex flexDirection="column" width="100%">
          <Flex justifyContent="space-between" width="100%">
            <NotificationImage image={image} title={title} message={description} />
            <Flex flexDirection="column" width="100%">
              <Text fontWeight={600}>{title}</Text>
              <FlexGap alignItems="center" gap="6px">
                <Dot show color="success" />
                <Text fontSize="13px" color="textSubtle">
                  {formattedDate}
                </Text>
                <NotificationBadge title={title} message={description} />
              </FlexGap>
            </Flex>
            <BottomRow show={show} elementHeight={elementHeight} />
          </Flex>
          <Description ref={contentRef} show={show} elementHeight={elementHeight}>
            <Text>{formatedDescription}</Text>
            {url !== '' ? (
              <StyledLink hidden href={url} target="_blank" rel="noreferrer noopener">
                {getLinkText(title)}
              </StyledLink>
            ) : null}
          </Description>
        </Flex>
      </ContentsContainer>
    </StyledNotificationWrapper>
  )
}

const NotificationContainer = ({ notifications, isClosing }: INotificationContainerProps) => {
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
      {notifications.map((notification: NotifyClientTypes.NotifyMessageRecord) => {
        return (
          <NotificationItem
            key={notification.id}
            title={notification.message.title}
            description={notification.message.body}
            date={notification.publishedAt}
            url={notification.message.url}
            image={notification.message.icon}
            id={notification.id}
          />
        )
      })}
    </NotificationsWrapper>
  )
}

export default NotificationContainer
