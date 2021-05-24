import React from 'react'
import { Card, CardHeader, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import VotesLoading from '../components/Proposal/VotesLoading'
import { Proposal } from '../types'

interface VotesProps {
  proposal: Proposal
}

const Votes: React.FC<VotesProps> = ({ proposal }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Votes (WIP)')}
        </Heading>
      </CardHeader>
      <VotesLoading />
    </Card>
  )
}

export default Votes
