import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, CardHeader, CardProps, Heading, Radio, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Proposal } from '../types'

interface VoteProps extends CardProps {
  proposal: Proposal
}

const Choice = styled.label<{ isChecked: boolean }>`
  align-items: center;
  border: 1px solid ${({ theme, isChecked }) => theme.colors[isChecked ? 'success' : 'borderColor']};
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  margin-bottom: 16px;
  padding: 16px;
`

const Vote: React.FC<VoteProps> = ({ proposal, ...props }) => {
  const [vote, setVote] = useState('')
  const { t } = useTranslation()

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget
    setVote(value)
  }

  return (
    <Card {...props}>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Cast your vote')}
        </Heading>
      </CardHeader>
      <CardBody>
        {proposal.choices.map((choice) => {
          const isChecked = choice === vote

          return (
            <Choice key={choice} isChecked={isChecked}>
              <Radio scale="sm" value={choice} checked={isChecked} onChange={handleChange} />
              <Text ml="16px">{choice}</Text>
            </Choice>
          )
        })}
        <Button disabled={!vote}>{t('Cast Vote')}</Button>
      </CardBody>
    </Card>
  )
}

export default Vote
