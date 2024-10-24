import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Progress, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { Vote } from 'state/types'
import TextEllipsis from '../../components/TextEllipsis'
import { calculateVoteResults, getTotalFromVotes } from '../../helpers'

interface SingleVoteResultsProps {
  choices: string[]
  votes: Vote[]
}

export const SingleVoteResults: React.FC<SingleVoteResultsProps> = ({ votes, choices }) => {
  const { t } = useTranslation()
  const results = calculateVoteResults(votes)
  const totalVotes = getTotalFromVotes(votes)

  return (
    <>
      {choices.map((choice, index) => {
        const choiceVotes = results[choice] || []
        const totalChoiceVote = getTotalFromVotes(choiceVotes)
        const progress = totalVotes === 0 ? 0 : (totalChoiceVote / totalVotes) * 100

        return (
          <Box key={choice} mt={index > 0 ? '24px' : '0px'}>
            <Flex alignItems="center" mb="8px">
              <TextEllipsis mb="4px" title={choice}>
                {choice}
              </TextEllipsis>
            </Flex>
            <Box mb="4px">
              <Progress primaryStep={progress} scale="sm" />
            </Box>
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="textSubtle">{t('%total% Votes', { total: formatNumber(totalChoiceVote, 0, 2) })}</Text>
              <Text>{progress.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</Text>
            </Flex>
          </Box>
        )
      })}
    </>
  )
}
