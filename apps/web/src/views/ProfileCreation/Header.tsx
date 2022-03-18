import { useContext } from 'react'
import styled from 'styled-components'
import { Breadcrumbs, Heading, Text, Link, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { TranslateFunction } from 'contexts/Localization/types'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const Wrapper = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-top: 32px;
  margin-bottom: 24px;
  padding-bottom: 24px;
`

const steps = (t: TranslateFunction) => [
  t('Get Starter Collectible'),
  t('Set Profile Picture'),
  t('Join Team'),
  t('Set Name'),
]

const Header: React.FC = () => {
  const { t } = useTranslation()
  const { currentStep } = useContext(ProfileCreationContext)

  return (
    <Wrapper>
      <Heading as="h1" scale="xxl" color="secondary" mb="8px" id="profile-setup-title">
        {t('Profile Setup')}
      </Heading>
      <Heading as="h2" scale="lg" mb="8px">
        {t('Show off your stats and collectibles with your unique profile')}
      </Heading>
      <Text color="textSubtle" mb="8px">
        {t('Total cost: 1.5 CAKE')}
      </Text>
      <Link href={`${nftsBaseUrl}/profile`}>
        <Button mb="24px" scale="sm" variant="secondary">
          {t('Back to profile')}
        </Button>
      </Link>
      <Breadcrumbs>
        {steps(t).map((translationKey, index) => {
          return (
            <Text key={t(translationKey)} color={index <= currentStep ? 'text' : 'textDisabled'}>
              {translationKey}
            </Text>
          )
        })}
      </Breadcrumbs>
    </Wrapper>
  )
}

export default Header
