import { Text, Flex, Message, Box, HelpIcon } from '@pancakeswap/uikit'
import { Auction, ConnectedBidder } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'

const NotWhitelistedNotice: React.FC<{ connectedBidder: ConnectedBidder; auction: Auction }> = ({
  connectedBidder,
  auction,
}) => {
  const { t } = useTranslation()
  if ((connectedBidder && connectedBidder.isWhitelisted) || !auction) {
    return null
  }
  return (
    <Flex mb="24px" justifyContent="center">
      <Message variant="warning" icon={<HelpIcon width="24px" />}>
        <Box maxWidth="800px">
          <Text bold>{t('Notice')}</Text>
          <Text>{t('This page is a functional page, for projects to bid for farms.')}</Text>
          <Text>
            {t(
              'If you’re not a whitelisted project, you won’t be able to participate, but you can still view the auction bids in real time!',
            )}
          </Text>
          <Text>{t('Connect a whitelisted project wallet to participate in Auctions.')}</Text>
        </Box>
      </Message>
    </Flex>
  )
}

export default NotWhitelistedNotice
