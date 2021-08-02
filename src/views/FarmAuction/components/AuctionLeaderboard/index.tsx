import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Card, Flex, Box, Spinner } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Auction, AuctionStatus, Bidder } from 'config/constants/types'
import { TabToggleGroup, TabToggle } from '../TabToggle'
import AuctionHistory from '../AuctionHistory'
import AuctionProgress from './AuctionProgress'
import AuctionRibbon from './AuctionRibbon'
import AuctionLeaderboardTable from './AuctionLeaderboardTable'

const AuctionLeaderboardCard = styled(Card)`
  width: 100%;
  overflow: visible;
  flex: 2;
`

interface AuctionLeaderboardProps {
  auction: Auction
  bidders: Bidder[]
}

enum Tabs {
  Latest,
  Archive,
}

const getMostRecentClosedAuctionId = (latestAuctionId: number, latestAuctionStatus: AuctionStatus) => {
  if (latestAuctionStatus === AuctionStatus.Closed) {
    return latestAuctionId
  }
  if (latestAuctionId === 0) {
    return null
  }
  return latestAuctionId - 1
}

const CurrentAuctionCard: React.FC<AuctionLeaderboardProps> = ({ auction, bidders }) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(Tabs.Latest)

  if (!auction || !bidders) {
    return (
      <AuctionLeaderboardCard>
        <TabToggleGroup>
          <TabToggle isActive={activeTab === Tabs.Latest} onClick={() => setActiveTab(Tabs.Latest)}>
            {t('Latest')}
          </TabToggle>
          <TabToggle isActive={activeTab === Tabs.Archive} onClick={() => setActiveTab(Tabs.Archive)}>
            {t('Archive')}
          </TabToggle>
        </TabToggleGroup>
        <Flex justifyContent="center" alignItems="center" flexDirection="column" height="320px">
          <Spinner />
        </Flex>
      </AuctionLeaderboardCard>
    )
  }
  const { id, status } = auction

  return (
    <AuctionLeaderboardCard>
      <TabToggleGroup>
        <TabToggle isActive={activeTab === Tabs.Latest} onClick={() => setActiveTab(Tabs.Latest)}>
          {t('Latest')}
        </TabToggle>
        <TabToggle isActive={activeTab === Tabs.Archive} onClick={() => setActiveTab(Tabs.Archive)}>
          {t('Archive')}
        </TabToggle>
      </TabToggleGroup>
      {activeTab === Tabs.Latest ? (
        <Box position="relative">
          <Text bold fontSize="20px" py="24px" px={['12px', '24px']}>
            {t('Auction #%auctionId%', { auctionId: id })}
          </Text>
          <AuctionRibbon auction={auction} noAuctionHistory={getMostRecentClosedAuctionId(id, status) === null} />
          <AuctionProgress auction={auction} />
          <AuctionLeaderboardTable bidders={bidders} noBidsText="No bids yet" />
        </Box>
      ) : (
        <AuctionHistory mostRecentClosedAuctionId={getMostRecentClosedAuctionId(id, status)} />
      )}
    </AuctionLeaderboardCard>
  )
}

export default CurrentAuctionCard
