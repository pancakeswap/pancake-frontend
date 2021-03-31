import React from 'react'
import { Heading, Button, Text } from '@pancakeswap-libs/uikit'
import history from 'routerHistory'
import useI18n from 'hooks/useI18n'
import { CompetitionProps } from 'views/TradingCompetition/types'

const ReactivateProfile: React.FC<CompetitionProps> = ({ onDismiss }) => {
  const TranslateString = useI18n()

  const handleClick = () => {
    history.push('/profile')
    onDismiss()
  }

  return (
    <>
      <Heading size="md" mb="24px">
        {TranslateString(999, 'Reactivate your profile!')}
      </Heading>
      <Text color="textSubtle">
        {TranslateString(
          999,
          'It looks like you’ve disabled your account by removing your Pancake Collectible (NFT) profile picture.',
        )}
      </Text>
      <Text>
        {TranslateString(
          999,
          ' You need to reactivate your profile by replacing your profile picture, in order to join the competition.',
        )}
      </Text>
      <Button mt="24px" width="100%" onClick={handleClick}>
        {TranslateString(999, 'Go to my profile')}
      </Button>
    </>
  )
}

export default ReactivateProfile
