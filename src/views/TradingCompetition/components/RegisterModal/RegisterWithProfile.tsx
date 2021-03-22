import React from 'react'
import { Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const RegisterWithProfile = () => {
  const TranslateString = useI18n()

  return (
    <>
      <span>Register with profile</span> <Button>{TranslateString(464, 'Confirm')}</Button>
    </>
  )
}

export default RegisterWithProfile
