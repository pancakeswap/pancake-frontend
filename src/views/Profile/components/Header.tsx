import { Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import React from 'react'
import styled from 'styled-components'

const StyledProfileHeader = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 24px;
`

const ProfileHeader = () => {
  const TranslateString = useI18n()

  return (
    <StyledProfileHeader>
      <Heading as="h1" size="xxl" mb="8px" color="secondary">
        {TranslateString(999, 'Your Profile')}
      </Heading>
      <Heading as="h2" size="lg" mb="16px">
        {TranslateString(999, 'Check your stats and collect achievements')}
      </Heading>
    </StyledProfileHeader>
  )
}

export default ProfileHeader
