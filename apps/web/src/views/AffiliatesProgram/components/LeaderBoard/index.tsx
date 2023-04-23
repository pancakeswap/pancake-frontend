import { useTranslation } from '@pancakeswap/localization'
import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'
import Banner from 'views/AffiliatesProgram/components/Dashboard/Banner'
import Podium from 'views/AffiliatesProgram/components/LeaderBoard/Podium'
import LeaderBoardList from 'views/AffiliatesProgram/components/LeaderBoard/LeaderBoardList'
import useLeaderboard from 'views/AffiliatesProgram/hooks/useLeaderboard'

const LeaderBoard = () => {
  const { t } = useTranslation()
  const { list, isFetching } = useLeaderboard()

  return (
    <AffiliatesProgramLayout>
      <Banner title={t('Leaderboard')} subTitle={t('See who has invited the most friends')} />
      <Podium list={list} />
      <LeaderBoardList list={list} isFetching={isFetching} />
    </AffiliatesProgramLayout>
  )
}

export default LeaderBoard
