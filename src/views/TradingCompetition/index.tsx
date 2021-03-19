import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/hooks'
import Page from 'components/layout/Page'
import YourScore from './components/YourScore'
import RibbonWithImage from './components/RibbonWithImage'
import Prizes from './svgs/Prizes'
import Ranks from './svgs/Ranks'

const TradingCompetition = () => {
  const { account } = useWeb3React()
  const { profile } = useProfile()
  const registered = true

  return (
    <Page>
      <YourScore registered={registered} account={account} profile={profile} />
      <RibbonWithImage imageComponent={<Prizes width="175px" />} ribbonDirection="up">
        Prizes
      </RibbonWithImage>
      <RibbonWithImage imageComponent={<Ranks width="175px" />} ribbonDirection="down">
        Team Ranks
      </RibbonWithImage>
    </Page>
  )
}

export default TradingCompetition
