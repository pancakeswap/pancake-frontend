import { Box, Text, Flex, Card, CardBody, CardHeader, Heading, Progress } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import TextEllipsis from '../components/TextEllipsis'

const { VotedTag } = FarmWidget.Tags

interface ResultsProps {
  choices: string[]
  choiceVotesScores: number[]
  totalVotesScores: number
  accountVoteChoice: number | undefined
}

const Results: React.FC<React.PropsWithChildren<ResultsProps>> = ({
  choices,
  accountVoteChoice,
  choiceVotesScores,
  totalVotesScores,
}) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Current Results')}
        </Heading>
      </CardHeader>
      <CardBody>
        {choices.map((choice, index) => {
          const choiceVote = choiceVotesScores[index]
          const progress = totalVotesScores === 0 ? 0 : (choiceVote / totalVotesScores) * 100
          const hasVoted = accountVoteChoice === index + 1

          return (
            <Box key={choice} mt={index > 0 ? '24px' : '0px'}>
              <Flex alignItems="center" mb="8px">
                <TextEllipsis mb="4px" title={choice}>
                  {choice}
                </TextEllipsis>
                {hasVoted && <VotedTag mr="4px" />}
              </Flex>
              <Box mb="4px">
                <Progress primaryStep={progress} scale="sm" />
              </Box>
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="textSubtle">{t('%total% Votes', { total: formatNumber(choiceVote, 0, 2) })}</Text>
                <Text>
                  {progress.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                </Text>
              </Flex>
            </Box>
          )
        })}
      </CardBody>
    </Card>
  )
}

export default Results
