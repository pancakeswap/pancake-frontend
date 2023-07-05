import { useTranslation } from '@pancakeswap/localization'
import { PaginationButton, Box, Text } from '@pancakeswap/uikit'
import { RankListDetail } from 'views/TradingReward/hooks/useRankList'
import MobileResult, { StyledMobileRow } from 'views/TradingReward/components/Leaderboard/MobileResult'

interface LeaderBoardMobileViewProps {
  data: RankListDetail[]
  maxPage: number
  isLoading: boolean
  currentPage: number
  setCurrentPage: (value: number) => void
}

const LeaderBoardMobileView: React.FC<React.PropsWithChildren<LeaderBoardMobileViewProps>> = ({
  data,
  isLoading,
  currentPage,
  maxPage,
  setCurrentPage,
}) => {
  const { t } = useTranslation()

  return (
    <Box>
      {isLoading ? (
        <StyledMobileRow>
          <Text padding="48px 0px" textAlign="center">
            {t('Loading...')}
          </Text>
        </StyledMobileRow>
      ) : (
        <>
          {!data || data?.length === 0 ? (
            <StyledMobileRow>
              <Text padding="48px 0px" textAlign="center">
                {t('No results')}
              </Text>
            </StyledMobileRow>
          ) : (
            <>
              {data?.map((rank) => (
                <MobileResult key={rank.rank} rank={rank} />
              ))}
            </>
          )}
        </>
      )}
      {data?.length > 0 && (
        <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
      )}
    </Box>
  )
}

export default LeaderBoardMobileView
