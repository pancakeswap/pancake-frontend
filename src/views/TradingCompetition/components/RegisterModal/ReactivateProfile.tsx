import React from 'react'
import { Heading, Button, Text } from '@pancakeswap/uikit'
import history from 'routerHistory'
import { useTranslation } from 'contexts/Localization'
import { CompetitionProps } from 'views/TradingCompetition/types'

const ReactivateProfile: React.FC<CompetitionProps> = ({ onDismiss }) => {
  const { t } = useTranslation()

  const handleClick = () => {
    history.push('/profile')
    onDismiss()
  }

  return (
    <>
      <Heading scale="md" mb="24px">
        {t('Reactivate your profile!')}
      </Heading>
      <Text color="textSubtle">
        {t('It looks like you’ve disabled your account by removing your Pancake Collectible (NFT) profile picture.')}
      </Text>
      <Text>
        {t(' You need to reactivate your profile by replacing your profile picture, in order to join the competition.')}
      </Text>
      <Button mt="24px" width="100%" onClick={handleClick}>
        {t('Go to my profile')}
      </Button>
    </>
  )
}

export default ReactivateProfile
