import { AnimatePresence, Box, ChevronDownIcon, ChevronUpIcon, CloseIcon, Flex, Row, Text } from '@pancakeswap/uikit'
import { PushClientTypes } from '@walletconnect/push-client'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ContentsContainer,
  Description,
  ExpandButton,
  StyledLink,
  StyledNotificationWrapper,
} from 'views/Notifications/styles'
import { formatTime } from 'views/Notifications/utils/date'
import FlexRow from 'views/Predictions/components/FlexRow'

interface INotificationprops {
  title: string
  description: string
  id: number
  date: number
  removeNotification: (id: number) => Promise<void>
  url?: string
  image?: string
}

const NotificationItem = ({ title, description, id, date, url, image, removeNotification }: INotificationprops) => {
  const [isHovered, setIsHovered] = useState(false)
  const formattedDate = formatTime(Math.floor(date / 1000).toString())
  const [textClamped, setTextClamped] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [elementHeight, setElementHeight] = useState<number>(0)
  const [animating, setAnimating] = useState<boolean>(false)
  const containerRef = useRef(null)
  const [isClosing, setIsClosing] = useState<boolean>(false)

  const y = false

  const deleteNotification = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      setIsClosing(true)
      setTimeout(() => {
        removeNotification(id).then(() => setIsClosing(false))
      }, 300)
    },
    [removeNotification, id],
  )

  const handleHover = useCallback(() => {
    setIsHovered(!isHovered)
  }, [isHovered])

  const contentRef = useRef<HTMLElement>(null)

  const handleExpandClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement
      if (!animating && target.tagName !== 'BUTTON') {
        setShow(!show)
      }
    },
    [animating, show],
  )

  useEffect(() => {
    if (contentRef.current) {
      setElementHeight(contentRef.current.scrollHeight)
      setTextClamped(contentRef.current.scrollHeight > contentRef.current.clientHeight + 6)
    }
  }, [])

  return (
    <StyledNotificationWrapper
      transition={{ duration: 0.05 }}
      whileHover={{ scale: 1.01 }}
      isclosing={isClosing}
      ref={containerRef}
      onClick={handleExpandClick}
    >
      <AnimatePresence>
        <ContentsContainer
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: !isHovered ? '#f7f6f9' : 'white',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
        >
          <Box marginRight="15px" display="flex" minWidth="40px">
            <Image src="/logo.png" alt="Notification Image" height={40} width={40} />
          </Box>
          <Flex flexDirection="column">
            <Flex justifyContent="space-between">
              <Text fontWeight="bold">{title}</Text>
              <Box paddingX="5px" height="fit-content" onClick={deleteNotification}>
                <CloseIcon cursor="pointer" />
              </Box>
            </Flex>
            <Description
              ref={contentRef}
              transition={{ duration: 0.33, ease: 'easeInOut' }}
              initial={{ maxHeight: 32 }}
              animate={{ maxHeight: show ? elementHeight : 32 }}
              onAnimationStart={() => {
                setAnimating(true)
                if (show) {
                  if (contentRef.current) {
                    contentRef.current.style.webkitLineClamp = 'unset'
                  }
                }
              }}
              onAnimationComplete={() => {
                setAnimating(false)
                if (!show) {
                  if (contentRef.current) {
                    contentRef.current.style.webkitLineClamp = '2'
                  }
                }
              }}
            >
              {description}
              {url ? (
                <StyledLink href={url} target="_blank" rel="noreferrer noopener">
                  View Link
                </StyledLink>
              ) : null}
            </Description>
            {textClamped ? (
              <Row justifyContent="space-between">
                <FlexRow>
                  <ExpandButton color="secondary" marginY="5px" fontSize="15px">
                    {show ? 'Show Less' : 'Show More'}
                  </ExpandButton>
                  {show ? <ChevronUpIcon color="secondary" /> : <ChevronDownIcon color="secondary" />}
                </FlexRow>
                <Text fontSize="15px" marginRight="8px">
                  {formattedDate}
                </Text>
              </Row>
            ) : null}
          </Flex>
        </ContentsContainer>
      </AnimatePresence>
    </StyledNotificationWrapper>
  )
}

const NotificationContainer = ({
  transactions,
  sortOptionsType,
  removeNotification,
}: {
  transactions: any[] // PushClientTypes.PushMessageRecord[]
  sortOptionsType: string
  removeNotification: (id: number) => Promise<void>
}) => {
  if (transactions.length === 0) return <></>
  return (
    <>
      <Box>
        {transactions
          .sort((a: PushClientTypes.PushMessageRecord, b: PushClientTypes.PushMessageRecord) => {
            if (sortOptionsType === 'Latest') return b.publishedAt - a.publishedAt
            return a.publishedAt - b.publishedAt
          })
          .map((notification: PushClientTypes.PushMessageRecord) => {
            return (
              <NotificationItem
                key={notification.id}
                title={notification.message.title}
                description={notification.message.body}
                id={notification.id}
                date={notification.publishedAt}
                url={notification.message.url}
                image={notification.message.icon}
                removeNotification={removeNotification}
              />
            )
          })}
      </Box>
    </>
  )
}

export default NotificationContainer
