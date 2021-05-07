import React from 'react'
import { Button, Heading, Text } from '@pancakeswap/uikit'
import history from 'routerHistory'
import { useTranslation } from 'contexts/Localization'
import { CompetitionProps } from 'views/TradingCompetition/types'

const MakeProfile: React.FC<CompetitionProps> = ({ onDismiss }) => {
  const { t } = useTranslation()

  const handleClick = () => {
    history.push('/profile')
    onDismiss()
  }

  return (
    <>
      <Heading size="md" mb="24px">
        {t('Make a profile!')}
      </Heading>
      <Text color="textSubtle">
        It looks like you’ve disabled your account by removing your Pancake Collectible (NFT) profile picture.
      </Text>
      <Button mt="24px" width="100%" onClick={handleClick}>
        {t('Make a profile')}
      </Button>
    </>
  )
}

export default MakeProfile
