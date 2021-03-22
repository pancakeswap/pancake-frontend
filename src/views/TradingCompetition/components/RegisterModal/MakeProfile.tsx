import React from 'react'
import { Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const MakeProfile = () => {
  const TranslateString = useI18n()

  return (
    <>
      <span>Make new profile</span> <Button>{TranslateString(999, 'Make a profile')}</Button>
    </>
  )
}

export default MakeProfile
