import { Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import React from 'react'
import HeaderWrapper from './HeaderWrapper'

const ProfileHeader = () => {
  const TranslateString = useI18n()

  return (
    <HeaderWrapper>
      <Heading as="h1" size="xxl" mb="8px" color="secondary">
        {TranslateString(999, 'Your Profile')}
      </Heading>
      <Heading as="h2" size="lg" mb="16px">
        {TranslateString(999, 'Check your stats and collect achievements')}
      </Heading>
    </HeaderWrapper>
  )
}

export default ProfileHeader
