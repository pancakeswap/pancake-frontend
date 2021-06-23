import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, CardHeader, CardProps, Heading, Radio, Text, useModal } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { Proposal } from 'state/types'
import { fetchVotes } from 'state/voting'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
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

const ChoiceText = styled.div`
  flex: 1;
  padding-left: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 0;
`

const Vote: React.FC<VoteProps> = ({ proposal, ...props }) => {
  const [vote, setVote] = useState<State>(null)
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const dispatch = useAppDispatch()

  const handleSuccess = async () => {
    toastSuccess(t('Vote cast!'))
    dispatch(fetchVotes({ proposalId: proposal.id, block: Number(proposal.snapshot) }))
  }

  const [presentCastVoteModal] = useModal(
    <CastVoteModal onSuccess={handleSuccess} proposalId={proposal.id} vote={vote} block={Number(proposal.snapshot)} />,
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
          const isChecked = index + 1 === vote?.value

          const handleChange = () => {
            setVote({
              label: choice,
              value: index + 1,
            })
          }

          return (
            <Choice key={choice} isChecked={isChecked}>
              <div style={{ flexShrink: 0 }}>
                <Radio scale="sm" value={choice} checked={isChecked} onChange={handleChange} />
              </div>
              <ChoiceText>
                <Text as="span" title={choice}>
                  {choice}
                </Text>
              </ChoiceText>
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
