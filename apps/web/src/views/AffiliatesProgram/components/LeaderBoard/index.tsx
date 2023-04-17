import { useTranslation } from '@pancakeswap/localization'
import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'
import Banner from 'views/AffiliatesProgram/components/Dashboard/Banner'
import Podium from 'views/AffiliatesProgram/components/LeaderBoard/Podium'

const LeaderBoard = () => {
  const { t } = useTranslation()

  return (
    <AffiliatesProgramLayout>
      <Banner title={t('Leaderboard')} subTitle={t('See who has invited the most friends')} />
      <Podium />
    </AffiliatesProgramLayout>
  )
}

LeaderBoard.chains = []

export default LeaderBoard
