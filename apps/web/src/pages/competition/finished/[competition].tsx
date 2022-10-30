import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import EasterCompetition from '../../../views/TradingCompetition/EasterCompetition'
import MoboxCompetition from '../../../views/TradingCompetition/MoboxCompetition'
import FanTokenCompetition from '../../../views/TradingCompetition/FanTokenCompetition'
import TabMenu from '../../../views/TradingCompetition/components/TabMenu'

const CompetitionPage = () => {
  const router = useRouter()
  const { isMobile } = useMatchBreakpoints()
  const { competition: competitionId } = router.query

  const competitionPage = useMemo(() => {
    if (competitionId === 'easter') {
      return <EasterCompetition />
    }

    if (competitionId === 'mobox') {
      return <MoboxCompetition />
    }

    if (competitionId === 'fantoken') {
      return <FanTokenCompetition />
    }

    return null
  }, [competitionId])

  return (
    <>
      <Flex justifyContent="center" mt={isMobile ? '30px' : '28px'}>
        <TabMenu />
      </Flex>
      {competitionPage}
    </>
  )
}

export default CompetitionPage
