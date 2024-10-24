import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Progress, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useMemo } from 'react'
import { WeightedVoteState } from 'views/Voting/Proposal/VoteType/types'
import TextEllipsis from '../../components/TextEllipsis'

interface WeightedVoteResultsProps {
  choices: string[]
  sortData?: boolean
  choicesVotes: WeightedVoteState[]
}

export const WeightedVoteResults: React.FC<WeightedVoteResultsProps> = ({ choices, sortData, choicesVotes }) => {
  const { t } = useTranslation()

  const totalSum = useMemo(
    () => choicesVotes.reduce((sum, item) => sum + Object.values(item).reduce((a, b) => a + b, 0), 0),
    [choicesVotes],
  )

  const percentageResults = useMemo(
    () =>
      choicesVotes.reduce((acc, item) => {
        Object.entries(item).forEach(([key, value]) => {
          // eslint-disable-next-line no-param-reassign
          acc[key] = (acc[key] || 0) + value
        })
        return acc
      }, {}),
    [choicesVotes],
  )

  const sortedChoices = useMemo(() => {
    const list = choices.map((choice, index) => {
      const totalChoiceVote = percentageResults[index + 1] ?? 0
      const progress = (totalChoiceVote / totalSum) * 100
      return { choice, totalChoiceVote, progress }
    })

    return sortData ? list.sort((a, b) => b.progress - a.progress) : list
  }, [choices, percentageResults, sortData, totalSum])

  return (
    <>
      {sortedChoices.map(({ choice, totalChoiceVote, progress }, index) => (
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
            <Text>
              {totalChoiceVote === 0 && totalSum === 0
                ? '0.00%'
                : `${progress.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                %`}
            </Text>
          </Flex>
        </Box>
      ))}
    </>
  )
}
