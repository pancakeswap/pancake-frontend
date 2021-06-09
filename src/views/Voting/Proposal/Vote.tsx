import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, CardHeader, CardProps, Heading, Radio, Text, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Proposal } from '../types'
import CastVoteModal from '../components/Proposal/CastVoteModal'

interface VoteProps extends CardProps {
  proposal: Proposal
}

interface State {
  label: string
  value: number
}

const Choice = styled.label<{ isChecked: boolean }>`
  align-items: center;
  border: 1px solid ${({ theme, isChecked }) => theme.colors[isChecked ? 'success' : 'cardBorder']};
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  margin-bottom: 16px;
  padding: 16px;
`

const Vote: React.FC<VoteProps> = ({ proposal, ...props }) => {
  const [vote, setVote] = useState<State>(null)
  const { t } = useTranslation()
  const [presentCastVoteModal] = useModal(
    <CastVoteModal proposalId={proposal.id} vote={vote} block={Number(proposal.snapshot)} />,
  )

  return (
    <Card {...props}>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Cast your vote')}
        </Heading>
      </CardHeader>
      <CardBody>
        {proposal.choices.map((choice, index) => {
          const isChecked = index === vote?.value

          const handleChange = () => {
            setVote({
              label: choice,
              value: index,
            })
          }

          return (
            <Choice key={choice} isChecked={isChecked}>
              <Radio scale="sm" value={choice} checked={isChecked} onChange={handleChange} />
              <Text ml="16px">{choice}</Text>
            </Choice>
          )
        })}
        <Button onClick={presentCastVoteModal} disabled={vote === null}>
          {t('Cast Vote')}
        </Button>
      </CardBody>
    </Card>
  )
}

export default Vote
