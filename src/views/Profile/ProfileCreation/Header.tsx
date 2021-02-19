import React, { useContext } from 'react'
import styled from 'styled-components'
import { Breadcrumbs, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const Wrapper = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 24px;
`

const steps = [
  { translationId: 776, label: 'Get Starter Collectible' },
  { translationId: 778, label: 'Set Profile Picture' },
  { translationId: 780, label: 'Join Team' },
  { translationId: 782, label: 'Set Name' },
]

const Header: React.FC = () => {
  const TranslateString = useI18n()
  const { currentStep } = useContext(ProfileCreationContext)

  return (
    <Wrapper>
      <Heading as="h1" size="xxl" color="secondary" mb="8px">
        {TranslateString(770, 'Profile Setup')}
      </Heading>
      <Heading as="h2" size="lg" mb="8px">
        {TranslateString(772, 'Show off your stats and collectibles with your unique profile')}
      </Heading>
      <Text color="textSubtle" mb="24px">
        {TranslateString(999, 'Total cost: 1.5 CAKE')}
      </Text>
      <Breadcrumbs>
        {steps.map(({ translationId, label }, index) => {
          return (
            <Text key={label} color={index <= currentStep ? 'text' : 'textDisabled'}>
              {TranslateString(translationId, label)}
            </Text>
          )
        })}
      </Breadcrumbs>
    </Wrapper>
  )
}

export default Header
