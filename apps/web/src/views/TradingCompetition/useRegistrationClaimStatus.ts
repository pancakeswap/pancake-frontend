import { useCallback, useState } from 'react'

export const useRegistrationClaimStatus = () => {
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false)
  const [claimSuccessful, setClaimSuccessful] = useState(false)

  const onRegisterSuccess = useCallback(() => {
    setRegistrationSuccessful(true)
  }, [setRegistrationSuccessful])

  const onClaimSuccess = useCallback(() => {
    setClaimSuccessful(true)
  }, [setClaimSuccessful])

  return { registrationSuccessful, claimSuccessful, onRegisterSuccess, onClaimSuccess }
}
