import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Flex } from '@pancakeswap-libs/uikit'
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
  //   debugger // eslint-disable-line no-debugger

  return (
    <Page>
      <YourScore registered={registered} account={account} profile={profile} />
      <Flex mt="32px" />
      <RibbonWithImage imageComponent={<Prizes width="175px" />} ribbonDirection="up" ribbonText="Prizes" />
      <Flex mt="32px" />
      <RibbonWithImage imageComponent={<Ranks width="175px" />} ribbonDirection="down" ribbonText="Team Ranks" />
    </Page>
  )
}

export default TradingCompetition
