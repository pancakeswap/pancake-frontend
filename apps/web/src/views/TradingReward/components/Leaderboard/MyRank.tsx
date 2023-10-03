import { useMemo } from 'react'
import { Card, Table, Th, Td, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useUserTradeRank } from 'views/TradingReward/hooks/useUserTradeRank'
import DesktopResult from 'views/TradingReward/components/Leaderboard/DesktopResult'
import MobileResult from 'views/TradingReward/components/Leaderboard/MobileResult'
import { useAccount } from 'wagmi'

interface MyRankProps {
  campaignId: string
}

const MyRank: React.FC<React.PropsWithChildren<MyRankProps>> = ({ campaignId }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isDesktop } = useMatchBreakpoints()
  const { data: userRank, isFetching } = useUserTradeRank({ campaignId })

  const rank = useMemo(
    () => ({
      origin: account,
      rank: userRank.topTradersIndex,
      tradingFee: userRank.tradingFee,
      volume: userRank.volume,
      estimateRewardUSD: userRank.estimateRewardUSD,
    }),
    [account, userRank],
  )

  if (!account) {
    return null
  }

  return (
    <Box mb="16px">
      <Card isActive margin="0 24px">
        {isDesktop ? (
          <Table>
            <thead>
              <tr>
                <Th textAlign="left" width="45%">
                  {t('My Rank')}
                </Th>
                <Th textAlign="left">{t('Trading Volume')}</Th>
                <Th textAlign="right">{t('Total Reward')}</Th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <Td colSpan={3} textAlign="center">
                    {t('Loading...')}
                  </Td>
                </tr>
              ) : (
                <DesktopResult key={rank.rank} rank={rank} />
              )}
            </tbody>
          </Table>
        ) : (
          <MobileResult rank={rank} isMyRank />
        )}
      </Card>
    </Box>
  )
}

export default MyRank
