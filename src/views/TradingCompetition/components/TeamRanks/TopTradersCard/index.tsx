import React, { useState, useEffect } from 'react'
import {
  Card,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  TabMenu,
  Tab,
  Box,
  Flex,
  ExpandableLabel,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { TeamRanksProps } from '../../../types'
import TopTradersGrid from './TopTradersGrid'

const TopTradersCard: React.FC<TeamRanksProps> = ({
  team1LeaderboardInformation,
  team2LeaderboardInformation,
  team3LeaderboardInformation,
  globalLeaderboardInformation,
  isGlobalLeaderboardDataComplete,
}) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [topTradersGridData, setTopTradersGridData] = useState(null)
  const handleItemClick = (index: number) => setActiveTab(index)
  const tabs = [t('Total'), 'Storm', 'Flippers', 'Cakers']

  useEffect(() => {
    const getData = () => {
      if (activeTab === 0) {
        setTopTradersGridData(globalLeaderboardInformation.data)
      }

      if (activeTab === 1) {
        setTopTradersGridData(team1LeaderboardInformation.leaderboardData.data)
      }

      if (activeTab === 2) {
        setTopTradersGridData(team2LeaderboardInformation.leaderboardData.data)
      }

      if (activeTab === 3) {
        setTopTradersGridData(team3LeaderboardInformation.leaderboardData.data)
      }
    }

    if (isGlobalLeaderboardDataComplete) {
      getData()
    }
  }, [
    isGlobalLeaderboardDataComplete,
    activeTab,
    globalLeaderboardInformation,
    team1LeaderboardInformation,
    team2LeaderboardInformation,
    team3LeaderboardInformation,
  ])

  return (
    <Card>
      <Box width="100%">
        <CardHeader>
          <Heading color="secondary" scale="lg">
            {t('Top Traders')}
          </Heading>
          <Text fontSize="14px" color="textSubtle">
            {t('Since start of the competition')}
          </Text>
        </CardHeader>
        <Box mt="16px">
          <TabMenu activeIndex={activeTab} onItemClick={handleItemClick}>
            {tabs.map((tabText) => {
              return <Tab key={tabText}>{tabText}</Tab>
            })}
          </TabMenu>
          <TopTradersGrid data={topTradersGridData} isExpanded={isExpanded} />
        </Box>
        <CardFooter p="0px">
          <Flex alignItems="center" justifyContent="center">
            <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? t('Hide') : t('Show More')}
            </ExpandableLabel>
          </Flex>
        </CardFooter>
      </Box>
    </Card>
  )
}

export default TopTradersCard
