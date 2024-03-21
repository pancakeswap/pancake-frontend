import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Table, Td, Th, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import DesktopResult from 'views/TradingReward/components/Leaderboard/DesktopResult'
import MobileResult from 'views/TradingReward/components/Leaderboard/MobileResult'
import { useUserTradeRank } from 'views/TradingReward/hooks/useUserTradeRank'
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
    () =>
      account
        ? {
            origin: account,
            rank: userRank.topTradersIndex,
            tradingFee: userRank.tradingFee,
            volume: userRank.volume,
            estimateRewardUSD: userRank.estimateRewardUSD,
          }
        : undefined,
    [account, userRank],
  )

  if (!rank) {
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
                <DesktopResult key={rank.rank} rank={rank as any} />
              )}
            </tbody>
          </Table>
        ) : (
          <MobileResult rank={rank as any} isMyRank />
        )}
      </Card>
    </Box>
  )
}

export default MyRank
