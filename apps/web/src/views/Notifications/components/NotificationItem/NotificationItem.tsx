import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import {
  arbitrumTokens,
  baseTokens,
  bscTestnetTokens,
  bscTokens,
  ethereumTokens,
  goerliTestnetTokens,
  lineaTokens,
  polygonZkEvmTokens,
  zksyncTokens,
} from '@pancakeswap/tokens'
import { ArrowDropDownIcon, Box, ChevronDownIcon, ChevronUpIcon, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { CurrencyLogo } from 'components/Logo'
import { ASSET_CDN } from 'config/constants/endpoints'
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
  getLinkText,
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

const BottomRow = ({ show }: { show: boolean }) => {
  const { t } = useTranslation()
  return (
    <Flex alignItems="flex-start">
      <Text color="primary" fontWeight={600} fontSize="14px">
        {show ? t('LESS') : t('MORE')}
      </Text>
      <ExpandButton>{show ? <ChevronUpIcon color="primary" /> : <ChevronDownIcon color="primary" />}</ExpandButton>
    </Flex>
  )
}

const tokensSet = {
  [ChainId.BSC]: bscTokens,
  [ChainId.ETHEREUM]: ethereumTokens,
  [ChainId.GOERLI]: goerliTestnetTokens,
  [ChainId.BSC_TESTNET]: bscTestnetTokens,
  [ChainId.POLYGON_ZKEVM]: polygonZkEvmTokens,
  [ChainId.ZKSYNC]: zksyncTokens,
  [ChainId.ARBITRUM_ONE]: arbitrumTokens,
  [ChainId.LINEA]: lineaTokens,
  [ChainId.BASE]: baseTokens,
}
export const tokenImageChainNameMapping = {
  [ChainId.BSC]: '',
  [ChainId.ETHEREUM]: 'eth/',
  [ChainId.POLYGON_ZKEVM]: 'polygon-zkevm/',
  [ChainId.ZKSYNC]: 'zksync/',
  [ChainId.ARBITRUM_ONE]: 'arbitrum/',
  [ChainId.LINEA]: 'linea/',
  [ChainId.BASE]: 'base/',
}

const getImageUrlFromToken = (chainId: number, address: string) => {
  return `https://tokens.pancakeswap.finance/images/${tokenImageChainNameMapping[chainId]}${address}.png`
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
  if (title.includes('APR Update')) {
    const { token1, token2, chainId } = extractTokensFromAPRString(message)
    const baseUrl0 = getImageUrlFromToken(chainId, token1)
    const baseUrl1 = getImageUrlFromToken(chainId, token2)
    console.log(token1, token2)

    return (
      <Box position="relative" minWidth="40px" minHeight="40px">
        <Box marginRight="8px" position="absolute" top={0} left={0}>
          <Image src={baseUrl0} alt="apr img" height={28} width={28} unoptimized />
        </Box>
        <Box marginRight="8px" position="absolute" bottom={0} right={0}>
          <Image src={baseUrl1} alt="apr img" height={24} width={24} unoptimized />
        </Box>
      </Box>
    )
  }
  if (title.includes('LP position')) {
    const { chainId } = extractTokensFromAPRString(message)
    return (
      <Box marginRight="8px" paddingY="4px" minWidth="40px">
        <Image
          src={`${ASSET_CDN}/web/native/${chainId}.png`}
          alt="Notification Image"
          height={40}
          width={40}
          unoptimized
        />
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
            <BottomRow show={show} />
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
      {notifications
        .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
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
            />
          )
        })}
    </NotificationsWrapper>
  )
}

export default NotificationContainer
