import React from 'react'
import {
  Box,
  Text,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Progress,
  Skeleton,
  Tag,
  CheckmarkCircleIcon,
} from '@tovaswapui/uikit'
import { useWeb3React } from '@web3-react/core'
import times from 'lodash/times'
import { Vote } from 'state/types'
import { formatNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { FetchStatus } from 'config/constants/types'
import { calculateVoteResults, getTotalFromVotes } from '../helpers'
import TextEllipsis from '../components/TextEllipsis'

interface ResultsProps {
  choices: string[]
  votes: Vote[]
  votesLoadingStatus: FetchStatus
}

const Results: React.FC<ResultsProps> = ({ choices, votes, votesLoadingStatus }) => {
  const { t } = useTranslation()
  const results = calculateVoteResults(votes)
  const { account } = useWeb3React()
  const totalVotes = getTotalFromVotes(votes)

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Current Results')}
        </Heading>
      </CardHeader>
      <CardBody>
        {votesLoadingStatus === FetchStatus.Fetched &&
          choices.map((choice, index) => {
            const choiceVotes = results[choice] || []
            const totalChoiceVote = getTotalFromVotes(choiceVotes)
            const progress = totalVotes === 0 ? 0 : (totalChoiceVote / totalVotes) * 100
            const hasVoted = choiceVotes.some((vote) => {
              return account && vote.voter.toLowerCase() === account.toLowerCase()
            })

            return (
              <Box key={choice} mt={index > 0 ? '24px' : '0px'}>
                <Flex alignItems="center" mb="8px">
                  <TextEllipsis mb="4px" title={choice}>
                    {choice}
                  </TextEllipsis>
                  {hasVoted && (
                    <Tag variant="success" outline ml="8px">
                      <CheckmarkCircleIcon mr="4px" /> {t('Voted')}
                    </Tag>
                  )}
                </Flex>
                <Box mb="4px">
                  <Progress primaryStep={progress} scale="sm" />
                </Box>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="textSubtle">{t('%total% Votes', { total: formatNumber(totalChoiceVote, 0, 2) })}</Text>
                  <Text>
                    {progress.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                  </Text>
                </Flex>
              </Box>
            )
          })}

        {votesLoadingStatus === FetchStatus.Fetching &&
          times(choices.length).map((count, index) => {
            return (
              <Box key={count} mt={index > 0 ? '24px' : '0px'}>
                <Skeleton height="36px" mb="4px" />
              </Box>
            )
          })}
      </CardBody>
    </Card>
  )
}

export default Results
