import React from 'react'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FanTokenAllBunnies from './pngs/fan-token-all-bunnies.png'
import MoboxAllBunnies from './pngs/mobox-all-bunnies.png'
import SubMenu from './components/SubMenu'
import FinishedCompetitionBanner from './components/FinishedCompetitionBanner'

const FinishedCompetitions: React.FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <SubMenu />
      <Flex flexDirection="column" justifyContent="center" alignItems="center" px="3rem" mb="24px" mt="24px">
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
