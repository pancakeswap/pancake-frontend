import React from 'react'
import { Box, Text, Flex, Card, CardBody, CardHeader, Heading, Progress, Skeleton } from '@pancakeswap/uikit'
import times from 'lodash/times'
import { Vote, VotingStatus } from 'state/types'
import { useGetVotingStatus } from 'state/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTranslation } from 'contexts/Localization'
import { calculateVoteResults } from '../helpers'

interface ResultsProps {
  choiceCount: number
  votes: Vote[]
}

const Results: React.FC<ResultsProps> = ({ choiceCount, votes }) => {
  const { t } = useTranslation()
  const results = calculateVoteResults(votes)
  const votingStatus = useGetVotingStatus()
  const totalVotes = results.reduce((accum, result) => {
    return accum.plus(result.total)
  }, BIG_ZERO)

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Current Results')}
        </Heading>
      </CardHeader>
      <CardBody>
        {votingStatus === VotingStatus.IDLE &&
          results.length > 0 &&
          results.map((result, index) => {
            const progress = result.total.div(totalVotes).times(100).toNumber()

            return (
              <Box key={result.label} mt={index > 0 ? '24px' : '0px'}>
                <Box mb="4px">
                  <Progress primaryStep={progress} scale="sm" />
                </Box>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="textSubtle">{t('%total% Votes', { total: result.total.toFixed(2) })}</Text>
                  <Text>
                    {progress.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}%
                  </Text>
                </Flex>
              </Box>
            )
          })}
        {votingStatus === VotingStatus.IDLE && results.length === 0 && (
          <Flex alignItems="center">
            <Text fontSize="14px" bold>
              {t('No votes cast yet')}
            </Text>
          </Flex>
        )}
        {votingStatus === VotingStatus.LOADING &&
          times(choiceCount).map((count, index) => {
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
