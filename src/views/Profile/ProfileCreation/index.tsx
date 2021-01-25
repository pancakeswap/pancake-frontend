import React, { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import UnlockButton from 'components/UnlockButton'
import Mint from './Mint'
import TeamSelection from './TeamSelection'
import Header from './Header'
import ProfilePicture from './ProfilePicture'

const NoWallet = styled.div``

const ProfileCreation = () => {
  const [step, setStep] = useState(0)
  const [team, setTeam] = useState(null)
  const TranslateString = useI18n()
  const { account } = useWallet()
  const nextStep = () => setStep((prevStep) => prevStep + 1)

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Mint nextStep={nextStep} />
      case 1:
        return <ProfilePicture nextStep={nextStep} />
      case 2:
        return <TeamSelection nextStep={nextStep} selectedTeam={team} handleTeamSelection={setTeam} />
      default:
        return null
    }
  }

  return (
    <Page>
      <Header breadcrumbIndex={step} />
      {account ? (
        renderStep()
      ) : (
        <NoWallet>
          <Heading size="xl" mb="8px">
            {TranslateString(999, 'Oops!')}
          </Heading>
          <Text as="p" mb="16px">
            {TranslateString(999, 'Please connect your wallet to continue')}
          </Text>
          <UnlockButton />
        </NoWallet>
      )}
    </Page>
  )
}

export default ProfileCreation
