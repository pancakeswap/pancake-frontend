import { styled } from 'styled-components'
import { Heading, Text } from '@pancakeswap/uikit'
import { useProfile } from 'state/profile/hooks'
import { useTranslation } from '@pancakeswap/localization'
import NoProfileCard from './NoProfileCard'

const HeaderWrapper = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 24px;
`

const TeamHeader = () => {
  const { t } = useTranslation()
  const { isInitialized, profile } = useProfile()
  const showProfileCallout = isInitialized && !profile

  return (
    <>
      {showProfileCallout && <NoProfileCard />}
      <HeaderWrapper>
        <Heading as="h1" scale="xxl" color="secondary">
          {t('Teams & Profiles')}
        </Heading>
        <Text bold>
          {t('Show off your stats and collectibles with your unique profile. Team features will be revealed soon!')}
        </Text>
      </HeaderWrapper>
    </>
  )
}

export default TeamHeader
