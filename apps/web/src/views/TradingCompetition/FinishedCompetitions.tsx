import React from 'react'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import FanTokenAllBunnies from './pngs/fan-token-all-bunnies.png'
import MoboxAllBunnies from './pngs/mobox-all-bunnies.png'
import FinishedCompetitionBanner from './components/FinishedCompetitionBanner'
import { TRADINGCOMPETITIONBANNER } from './pageSectionStyles'
import TabMenu from './components/TabMenu'

const FinishedCompetitions: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      <Flex justifyContent="center" mt={isMobile ? '30px' : '28px'}>
        <TabMenu />
      </Flex>
      <Flex
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        px="3rem"
        mb="24px"
        pt="24px"
        minHeight="calc(100vh - 64px)"
        background={TRADINGCOMPETITIONBANNER}
      >
        <FinishedCompetitionBanner
          title={t('Mobox Competition')}
          imgSrc={MoboxAllBunnies}
          background="radial-gradient(329.58% 50% at 50% 50%, #3B2864 0%, #191326 100%)"
          to="/competition/finished/mobox"
        />
        <FinishedCompetitionBanner
          title={t('Binance Fan token Trading Competition')}
          imgSrc={FanTokenAllBunnies}
          background="linear-gradient(#7645d9 0%, #452a7a 100%)"
          to="/competition/finished/fantoken"
        />
        <FinishedCompetitionBanner
          title={t('Easter Trading Competition')}
          imgSrc="/images/tc-easter-bunnies.png"
          background="radial-gradient(77.72% 89.66% at 79.76% 65.74%, #FEDC90 0%, #FFA514 74.5%)"
          to="/competition/finished/easter"
        />
      </Flex>
    </>
  )
}

export default FinishedCompetitions
