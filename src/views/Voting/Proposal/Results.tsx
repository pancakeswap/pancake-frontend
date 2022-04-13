import {
  Box,
  Text,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Progress,
  Tag,
  CheckmarkCircleIcon,
} from '@pancakeswap/uikit'
import { Proposal, Vote } from 'state/types'
import { formatNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import TextEllipsis from '../components/TextEllipsis'

interface ResultsProps {
  votes: Vote[]
  proposal: Proposal
  accountVoted?: Vote
}

const Results: React.FC<ResultsProps> = ({ proposal, votes, accountVoted }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Current Results')}
        </Heading>
      </CardHeader>
      <CardBody>
        {proposal.choices.map((choice, index) => {
          const totalChoiceVote = proposal.scores[index]
          const progress = proposal.scores_total === 0 ? 0 : (totalChoiceVote / proposal.scores_total) * 100
          const hasVoted = accountVoted && accountVoted.choice === index + 1

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
      </CardBody>
    </Card>
  )
}

export default Results
