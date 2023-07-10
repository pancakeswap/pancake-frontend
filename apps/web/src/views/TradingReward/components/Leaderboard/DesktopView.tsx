import { PaginationButton, Card, Table, Th, Td } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { RankListDetail } from 'views/TradingReward/hooks/useRankList'
import DesktopResult from 'views/TradingReward/components/Leaderboard/DesktopResult'

interface LeaderBoardDesktopViewProps {
  data: RankListDetail[]
  currentPage: number
  maxPage: number
  isLoading: boolean
  setCurrentPage: (value: number) => void
}

const LeaderBoardDesktopView: React.FC<React.PropsWithChildren<LeaderBoardDesktopViewProps>> = ({
  data,
  maxPage,
  isLoading,
  currentPage,
  setCurrentPage,
}) => {
  const { t } = useTranslation()
  return (
    <Card margin="0 24px">
      <Table>
        <thead>
          <tr>
            <Th textAlign="left">{t('Rank (Top 50 users)')}</Th>
            <Th textAlign="left">{t('Trading Volume')}</Th>
            <Th textAlign="right">{t('Total Reward')}</Th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <Td colSpan={3} textAlign="center">
                {t('Loading...')}
              </Td>
            </tr>
          ) : (
            <>
              {!data || data?.length === 0 ? (
                <tr>
                  <Td colSpan={3} textAlign="center">
                    {t('No results')}
                  </Td>
                </tr>
              ) : (
                <>
                  {data.map((rank) => (
                    <DesktopResult key={rank.rank} rank={rank} />
                  ))}
                </>
              )}
            </>
          )}
        </tbody>
      </Table>
      {data?.length > 0 && (
        <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
      )}
    </Card>
  )
}

export default LeaderBoardDesktopView
