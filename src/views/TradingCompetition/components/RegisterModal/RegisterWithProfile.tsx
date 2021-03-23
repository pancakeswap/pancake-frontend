import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, Text, Flex, Checkbox } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { CompetitionProps } from '../../types'

const StyledCheckbox = styled(Checkbox)`
  min-width: 24px;
`

const StyledLabel = styled.label`
  cursor: pointer;
`

const RegisterWithProfile: React.FC<CompetitionProps> = ({ profile }) => {
  const TranslateString = useI18n()
  const [isAcknowledged, setIsAcknowledged] = useState(false)

  return (
    <>
      <Heading size="md" mb="24px">{`@${profile.username}`}</Heading>
      <Flex flexDirection="column">
        <Text fontWeight="bold">
          {TranslateString(
            999,
            'Registering for the competition will make your wallet address publicly visible on the leaderboard.',
          )}
        </Text>
        <Text fontSize="14px" color="textSubtle" mb="24px">
          {TranslateString(999, 'This decision cannot be reversed.')}
        </Text>
        <StyledLabel htmlFor="acknowledgement">
          <Flex alignItems="center" justifyContent="space-between">
            <StyledCheckbox
              id="acknowledgement"
              checked={isAcknowledged}
              onChange={() => setIsAcknowledged(!isAcknowledged)}
              scale="sm"
            />
            <Text ml="16px">
              {TranslateString(
                999,
                'I understand that my address may be displayed publicly throughout the competition.',
              )}
            </Text>
          </Flex>
        </StyledLabel>
      </Flex>
      <Button mt="24px" width="100%" disabled={!isAcknowledged}>
        {TranslateString(464, 'Confirm')}
      </Button>
    </>
  )
}

export default RegisterWithProfile
