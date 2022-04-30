import React from 'react'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import SubMenu from './components/SubMenu'
import FinishedCompetitionBanner from './components/FinishedCompetitionBanner'

const FinishedCompetitions: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" px="3rem" mb="24px">
      <SubMenu />
      <FinishedCompetitionBanner
        title={t('Binance Fan token Trading Competition')}
        imgSrc="/images/tc-fantoken-bunnies.png"
        background="linear-gradient(#7645d9 0%, #452a7a 100%)"
      />
      <FinishedCompetitionBanner
        title={t('Easter Trading Competition')}
        imgSrc="/images/tc-easter-bunnies.png"
        background="radial-gradient(77.72% 89.66% at 79.76% 65.74%, #FEDC90 0%, #FFA514 74.5%)"
      />
    </Flex>
  )
}

export default FinishedCompetitions
