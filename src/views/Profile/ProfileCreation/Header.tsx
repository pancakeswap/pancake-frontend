import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { Breadcrumbs, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

interface HeaderProps {
  setStep: Dispatch<SetStateAction<number>>
  breadcrumbIndex?: number
}

const BreadcrumbLink = styled(Text)<{ isLink: boolean }>`
  color: ${({ isLink, theme }) => theme.colors[isLink ? 'text' : 'textDisabled']};
  cursor: ${({ isLink }) => (isLink ? 'pointer' : 'inherit')};
`

const Wrapper = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 24px;
`

const steps = [
  { translationId: 999, label: 'Get Starter Collectible' },
  { translationId: 999, label: 'Set Profile Picture' },
  { translationId: 999, label: 'Join Team' },
  { translationId: 999, label: 'Set Name' },
]

const Header: React.FC<HeaderProps> = ({ breadcrumbIndex = 0, setStep }) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <Heading as="h1" size="xxl" color="secondary" mb="8px">
        {TranslateString(999, 'Profile Setup')}
      </Heading>
      <Heading as="h2" size="lg" mb="8px">
        {TranslateString(999, 'Show off your stats and collectibles with your unique profile')}
      </Heading>
      <Text color="textSubtle" mb="24px">
        {TranslateString(999, 'Total cost: 10 CAKE')}
      </Text>
      <Breadcrumbs>
        {steps.map(({ translationId, label }, index) => {
          const isLink = index <= breadcrumbIndex

          return (
            <BreadcrumbLink key={label} isLink={isLink} onClick={isLink ? () => setStep(index) : undefined}>
              {TranslateString(translationId, label)}
            </BreadcrumbLink>
          )
        })}
      </Breadcrumbs>
    </Wrapper>
  )
}

export default Header
