import { useState, useEffect } from 'react'
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
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/chains'
import { LeaderboardDataItem, TeamRanksProps } from '../../../types'
import TopTradersGrid from './TopTradersGrid'

const TopTradersCard: React.FC<React.PropsWithChildren<TeamRanksProps & { subgraph?: string }>> = ({
  team1LeaderboardInformation,
  team2LeaderboardInformation,
  team3LeaderboardInformation,
  globalLeaderboardInformation,
  isGlobalLeaderboardDataComplete,
  subgraph,
}) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [topTradersGridData, setTopTradersGridData] = useState<LeaderboardDataItem[] | null | undefined>(null)
  const handleItemClick = (index: number) => setActiveTab(index)
  const tabs = [t('Total'), 'Storm', 'Flippers', 'Cakers']

  useEffect(() => {
    const getData = () => {
      if (activeTab === 0) {
        setTopTradersGridData(globalLeaderboardInformation?.data)
      }

      if (activeTab === 1) {
        setTopTradersGridData(team1LeaderboardInformation?.leaderboardData?.data)
      }

      if (activeTab === 2) {
        setTopTradersGridData(team2LeaderboardInformation?.leaderboardData?.data)
      }

      if (activeTab === 3) {
        setTopTradersGridData(team3LeaderboardInformation?.leaderboardData?.data)
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
    <Card id="top-traders-card">
      <Box width="100%">
        <CardHeader>
          <Flex justifyContent="space-between">
            <Flex flexDirection="column">
              <Heading color="secondary" scale="lg">
                {t('Top Traders')}
              </Heading>
              <Text fontSize="14px" color="textSubtle">
                {t('Since start of the competition')}
              </Text>
            </Flex>
            {subgraph && (
              <SubgraphHealthIndicator
                chainId={ChainId.BSC}
                subgraph={subgraph}
                inline
                obeyGlobalSetting={false}
                customDescriptions={{
                  delayed: t(
                    'Subgraph is currently experiencing delays due to BSC issues. Rank and volume data may be inaccurate until subgraph is restored.',
                  ),
                  slow: t(
                    'Subgraph is currently experiencing delays due to BSC issues. Rank and volume data may be inaccurate until subgraph is restored.',
                  ),
                  healthy: t('No issues with the subgraph.'),
                }}
              />
            )}
          </Flex>
        </CardHeader>
        <Box mt="16px">
          <TabMenu activeIndex={activeTab} onItemClick={handleItemClick}>
            {tabs.map((tabText) => {
              return <Tab key={tabText}>{tabText}</Tab>
            })}
          </TabMenu>
          <TopTradersGrid data={topTradersGridData || undefined} isExpanded={isExpanded} />
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
