import { useTranslation } from '@pancakeswap/localization'
import { ArrowDropDownIcon, ArrowDropUpIcon, Box, FlexGap, Text } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/image'
import { CHAIN_NAME_TO_CHAIN_ID } from 'views/Notifications/constants'
import {
  extractChainIdFromMessage,
  extractPercentageFromString,
  extractWordBeforeFullStop,
  getBadgeString,
  hasSingleFarm,
} from 'views/Notifications/utils/textHelpers'
import AlertIcon from '../../../../../public/images/notifications/alert-icon.svg'

export const getNotificationPairlogo = (title: string, message: string) => {
  const isAprNotification = title.includes('APR')
  const chainName = isAprNotification ? extractWordBeforeFullStop(message) : extractChainIdFromMessage(message)
  const chainId = CHAIN_NAME_TO_CHAIN_ID[chainName === 'polygon_zkevm.' ? 'polygon_zkevm' : chainName]

  const image1 = isAprNotification ? '/images/notifications/farms-scope.svg' : '/logo.png'
  const image2 = `${ASSET_CDN}/web/chains/${chainId}.png`

  return { image1, image2 }
}
export const NotificationImage = ({
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

export const NotificationBadge = ({ title, message }: { title: string; message: string }) => {
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

export const formatStringWithNewlines = (inputString: string, isMobile: boolean) => {
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
