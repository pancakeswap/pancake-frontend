import React from 'react'
import { Button, Heading, Text } from '@pancakeswap-libs/uikit'
import history from 'routerHistory'
import useI18n from 'hooks/useI18n'
import { CompetitionProps } from 'views/TradingCompetition/types'

const MakeProfile: React.FC<CompetitionProps> = ({ onDismiss }) => {
  const TranslateString = useI18n()

  const handleClick = () => {
    history.push('/profile')
    onDismiss()
  }

  return (
    <>
      <Heading size="md" mb="24px">
        {TranslateString(999, 'Make a profile!')}
      </Heading>
      <Text color="textSubtle">
        It looks like you’ve disabled your account by removing your Pancake Collectible (NFT) profile picture.
      </Text>
      <Button mt="24px" width="100%" onClick={handleClick}>
        {TranslateString(999, 'Make a profile')}
      </Button>
    </>
  )
}

export default MakeProfile
