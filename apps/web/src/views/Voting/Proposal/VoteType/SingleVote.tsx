import { Radio, Text } from '@pancakeswap/uikit'
import React, { Dispatch } from 'react'
import { Proposal, ProposalState } from 'state/types'
import { State } from 'views/Voting/Proposal/VoteType/types'
import { Choice, ChoiceText } from 'views/Voting/Proposal/VoteType/VoteStyle'
import { useAccount } from 'wagmi'

interface SingleVoteProps {
  proposal: Proposal
  vote: State
  setVote: Dispatch<State>
}

export const SingleVote: React.FC<SingleVoteProps> = ({ proposal, vote, setVote }) => {
  const { address: account } = useAccount()

  return (
    <>
      {proposal.choices.map((choice, index) => {
        const isChecked = index + 1 === vote.value

        const handleChange = () => {
          setVote({
            label: choice,
            value: index + 1,
          })
        }

        return (
          <Choice key={choice} isChecked={isChecked} isDisabled={!account}>
            <div style={{ flexShrink: 0 }}>
              <Radio
                scale="sm"
                value={choice}
                checked={isChecked}
                onChange={handleChange}
                disabled={!account || proposal.state === ProposalState.CLOSED}
              />
            </div>
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
