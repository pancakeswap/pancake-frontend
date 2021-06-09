import React, { useState } from 'react'
import {
  AutoRenewIcon,
  Card,
  CardHeader,
  ChevronDownIcon,
  Flex,
  Heading,
  Button,
  ChevronUpIcon,
  Text,
} from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import { useTranslation } from 'contexts/Localization'
import VotesLoading from '../components/Proposal/VotesLoading'
import { Vote } from '../types'
import VoteRow from '../components/Proposal/VoteRow'
import Row, { AddressColumn, ChoiceColumn, VotingPowerColumn } from '../components/Proposal/Row'

const VOTES_PER_VIEW = 20

interface VotesProps {
  votes: Vote[]
  isFinished: boolean
}

const Votes: React.FC<VotesProps> = ({ votes, isFinished }) => {
  const [showAll, setShowAll] = useState(false)
  const { t } = useTranslation()
  const displayVotes = showAll ? votes : votes.slice(0, VOTES_PER_VIEW)

  const handleClick = () => {
    setShowAll(!showAll)
  }

  return (
    <Card>
      <CardHeader>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading as="h3" scale="md">
            {t('Votes (%count%)', { count: votes.length.toLocaleString() })}
          </Heading>
          {!isFinished && <AutoRenewIcon spin width="22px" />}
        </Flex>
      </CardHeader>
      {!isFinished && <VotesLoading />}

      {isFinished && displayVotes.length > 0 && (
        <>
          <Row>
            <AddressColumn>
              <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold>
                {t('Voter')}
              </Text>
            </AddressColumn>
            <ChoiceColumn>
              <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold>
                {t('Decision')}
              </Text>
            </ChoiceColumn>
            <VotingPowerColumn>
              <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold>
                {t('Vote Weight')}
              </Text>
            </VotingPowerColumn>
          </Row>
          {orderBy(displayVotes, ['created'], ['desc']).map((vote) => {
            return <VoteRow key={vote.id} vote={vote} />
          })}
          <Flex alignItems="center" justifyContent="center" py="8px" px="24px">
            <Button
              width="100%"
              onClick={handleClick}
              variant="text"
              endIcon={
                showAll ? (
                  <ChevronUpIcon color="primary" width="21px" />
                ) : (
                  <ChevronDownIcon color="primary" width="21px" />
                )
              }
              disabled={!isFinished}
            >
              {showAll ? t('Hide') : t('See All')}
            </Button>
          </Flex>
        </>
      )}

      {isFinished && displayVotes.length === 0 && (
        <Flex alignItems="center" justifyContent="center" py="32px">
          <Heading as="h5">{t('No votes found')}</Heading>
        </Flex>
      )}
    </Card>
  )
}

export default Votes
