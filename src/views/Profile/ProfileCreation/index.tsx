import React, { useState } from 'react'
import { Button, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import Page from 'components/layout/Page'
import useI18n from 'hooks/useI18n'
import Mint from './Mint'
import TeamSelection from './TeamSelection'
import Header from './Header'

const ProfileCreation = () => {
  const [step, setStep] = useState(0)
  const [team, setTeam] = useState(null)
  const TranslateString = useI18n()

  const renderPageBody = () => {
    if (step === 0) {
      return <Mint />
    }
    if (step === 1) {
      return <TeamSelection selectedTeam={team} handleTeamSelection={setTeam} />
    }
    return null
  }

  return (
    <Page>
      <Header />
      {renderPageBody()}
      <Button endIcon={<ArrowForwardIcon color="white" />} mt="24px" onClick={() => setStep((prev) => prev + 1)}>
        {TranslateString(999, 'Next Step')}
      </Button>
    </Page>
  )
}

export default ProfileCreation
