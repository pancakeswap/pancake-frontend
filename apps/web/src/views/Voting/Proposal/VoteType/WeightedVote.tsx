import { Text } from '@pancakeswap/uikit'
import React from 'react'
import { Proposal } from 'state/types'
import { Choice, ChoiceText } from 'views/Voting/Proposal/VoteType/VoteStyle'
import { useAccount } from 'wagmi'

interface WeightedVoteProps {
  proposal: Proposal
}

export const WeightedVote: React.FC<WeightedVoteProps> = ({ proposal }) => {
  const { address: account } = useAccount()

  return (
    <>
      {proposal.choices.map((choice, index) => {
        return (
          <Choice key={choice} isDisabled={!account}>
            <ChoiceText>
              <Text as="span" title={choice}>
                {choice}
              </Text>
            </ChoiceText>
          </Choice>
        )
      })}
    </>
  )
}
