import { useTranslation } from '@pancakeswap/localization'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CheckmarkCircleIcon,
  Flex,
  Heading,
  Skeleton,
  Spinner,
  Tag,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Auction, AuctionStatus, ConnectedBidder } from 'config/constants/types'
import { styled } from 'styled-components'
import PlaceBidModal from '../PlaceBidModal'
import AuctionFooter from './AuctionFooter'
import AuctionSchedule from './AuctionSchedule'
import CannotBidMessage from './CannotBidMessage'

const AuctionDetailsCard = styled(Card)`
  flex: 1;
`

interface AuctionDetailsProps {
  auction: Auction | null
  connectedBidder: ConnectedBidder | null
  refreshBidders: () => void
}

const AuctionDetails: React.FC<React.PropsWithChildren<AuctionDetailsProps>> = ({
  auction,
  connectedBidder,
  refreshBidders,
}) => {
  const { t } = useTranslation()

  const [onPresentPlaceBid] = useModal(
    <PlaceBidModal
      connectedBidder={connectedBidder}
      refreshBidders={refreshBidders}
      initialBidAmount={auction?.initialBidAmount}
    />,
  )

  if (!auction) {
    return (
      <AuctionDetailsCard mb={['24px', null, null, '0']}>
        <CardHeader>
          <Heading>{t('Current Auction')}</Heading>
        </CardHeader>
        <CardBody>
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Spinner />
          </Flex>
        </CardBody>
      </AuctionDetailsCard>
    )
  }

  const getBidSection = () => {
    const notConnectedOrNotWhitelisted = !connectedBidder || (connectedBidder && !connectedBidder.isWhitelisted)
    const whitelistedAndReadyToBid = !notConnectedOrNotWhitelisted && connectedBidder.bidderData
    if (notConnectedOrNotWhitelisted || auction.status !== AuctionStatus.Open) {
      return <CannotBidMessage />
    }
    if (whitelistedAndReadyToBid) {
      const { amount, position } = connectedBidder.bidderData ?? {}
      return (
        <>
          <Tag outline variant="success" startIcon={<CheckmarkCircleIcon />}>
            {t('Connected as %projectName%', { projectName: connectedBidder.bidderData?.tokenName })}
          </Tag>
          <Flex justifyContent="space-between" width="100%" pt="24px">
            <Text small color="textSubtle">
              {t('Your existing bid')}
            </Text>
            <Text small>{getBalanceNumber(amount)} CAKE</Text>
          </Flex>
          <Flex justifyContent="space-between" width="100%" pt="8px">
            <Text small color="textSubtle">
              {t('Your position')}
            </Text>
            <Text small>{position ? `#${position}` : '-'}</Text>
          </Flex>
          <Button my="24px" width="100%" onClick={onPresentPlaceBid}>
            {t('Place bid')}
          </Button>
          <Text color="textSubtle" small>
            {t('If your bid is unsuccessful, you’ll be able to reclaim your CAKE after the auction.')}
          </Text>
        </>
      )
    }
    return (
      <>
        <Skeleton width="200px" height="28px" />
        <Flex justifyContent="space-between" width="100%" pt="24px" px="8px">
          <Skeleton width="120px" height="24px" />
          <Skeleton width="86px" height="24px" />
        </Flex>
        <Flex justifyContent="space-between" width="100%" pt="8px" px="8px">
          <Skeleton width="96px" height="24px" />
          <Skeleton width="42px" height="24px" />
        </Flex>
      </>
    )
  }

  const cardTitle = auction.status === AuctionStatus.Closed ? t('Next Auction') : t('Current Auction')

  return (
    <AuctionDetailsCard mb={['24px', null, null, '0']}>
      <CardHeader>
        <Heading>{cardTitle}</Heading>
      </CardHeader>
      <CardBody>
        <AuctionSchedule auction={auction} />
        <Flex mt="24px" flexDirection="column" justifyContent="center" alignItems="center">
          {getBidSection()}
        </Flex>
      </CardBody>
      <AuctionFooter auction={auction} />
    </AuctionDetailsCard>
  )
}

export default AuctionDetails
