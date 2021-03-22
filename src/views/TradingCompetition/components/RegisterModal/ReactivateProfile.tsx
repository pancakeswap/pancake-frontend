import React from 'react'
import { Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const ReactivateProfile = () => {
  const TranslateString = useI18n()

  return (
    <>
      <span>Reactivate profile</span> <Button>{TranslateString(999, 'Go to my profile')}</Button>
    </>
  )
}

export default ReactivateProfile
