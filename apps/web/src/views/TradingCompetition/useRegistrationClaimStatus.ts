import { useState } from 'react'

export const useRegistrationClaimStatus = () => {
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false)
  const [claimSuccessful, setClaimSuccessful] = useState(false)

  const onRegisterSuccess = () => {
    setRegistrationSuccessful(true)
  }

  const onClaimSuccess = () => {
    setClaimSuccessful(true)
  }

  return { registrationSuccessful, claimSuccessful, onRegisterSuccess, onClaimSuccess }
}
