import React from 'react'
import { Button, Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const MakeProfile = () => {
  const TranslateString = useI18n()

  return (
    <>
      <Heading size="md" mb="24px">
        {TranslateString(999, 'Make a profile!')}
      </Heading>

      <Button mt="24px">{TranslateString(999, 'Make a profile')}</Button>
    </>
  )
}

export default MakeProfile
