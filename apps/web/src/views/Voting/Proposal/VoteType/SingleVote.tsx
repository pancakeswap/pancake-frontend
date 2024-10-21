import { Radio, Text } from '@pancakeswap/uikit'
import React, { Dispatch } from 'react'
import { Proposal, ProposalState } from 'state/types'
import { styled } from 'styled-components'
import { State } from 'views/Voting/Proposal/VoteType/types'
import { useAccount } from 'wagmi'

const Choice = styled.label<{ isChecked: boolean; isDisabled: boolean }>`
  align-items: center;
  border: 1px solid ${({ theme, isChecked }) => theme.colors[isChecked ? 'success' : 'cardBorder']};
  border-radius: 16px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  margin-bottom: 16px;
  padding: 16px;
`

const ChoiceText = styled.div`
  flex: 1;
  padding-left: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 0;
`

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
