import React, { useState } from 'react'
import Page from 'components/layout/Page'
import Mint from './Mint'
import TeamSelection from './TeamSelection'
import Header from './Header'
import ProfilePicture from './ProfilePicture'

const ProfileCreation = () => {
  const [step, setStep] = useState(0)
  const [team, setTeam] = useState(null)

  const nextStep = () => setStep((prevStep) => prevStep + 1)

  return (
    <Page>
      <Header breadcrumbIndex={step} setStep={setStep} />
      {step === 0 && <Mint nextStep={nextStep} />}
      {step === 1 && <ProfilePicture nextStep={nextStep} />}
      {step === 2 && <TeamSelection nextStep={nextStep} selectedTeam={team} handleTeamSelection={setTeam} />}
    </Page>
  )
}

export default ProfileCreation
