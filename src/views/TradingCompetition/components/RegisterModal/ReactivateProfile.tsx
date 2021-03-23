import React from 'react'
import { Heading, Button, Text } from '@pancakeswap-libs/uikit'
import history from 'routerHistory'
import useI18n from 'hooks/useI18n'

const ReactivateProfile: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
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
        It looks like you’ve disabled your account by removing your Pancake Collectible (NFT) profile picture.
      </Text>
      <Text>
        You need to reactivate your profile by replacing your profile picture, in order to join the competition.
      </Text>
      <Button mt="24px" width="100%" onClick={handleClick}>
        {TranslateString(999, 'Go to my profile')}
      </Button>
    </>
  )
}

export default ReactivateProfile
