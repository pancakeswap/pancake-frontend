import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/hooks'
import Page from 'components/layout/Page'
import YourScore from './components/YourScore'

const TradingCompetition = () => {
  const { account } = useWeb3React()
  const { profile } = useProfile()
  const registered = true
  //   debugger // eslint-disable-line no-debugger

  return (
    <Page>
      <YourScore registered={registered} account={account} profile={profile} />
    </Page>
  )
}

export default TradingCompetition
