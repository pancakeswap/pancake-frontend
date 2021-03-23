import React from 'react'
import { Heading, Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const ReactivateProfile = () => {
  const TranslateString = useI18n()

  return (
    <>
      <Heading size="md" mb="24px">
        {TranslateString(999, 'Reactivate your profile!')}
      </Heading>
      <Button mt="24px">{TranslateString(999, 'Go to my profile')}</Button>
    </>
  )
}

export default ReactivateProfile
