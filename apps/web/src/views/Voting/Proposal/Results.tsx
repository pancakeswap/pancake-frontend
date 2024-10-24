import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, CardBody, CardHeader, Flex, Heading, Skeleton } from '@pancakeswap/uikit'
import { FetchStatus, TFetchStatus } from 'config/constants/types'
import { Proposal, ProposalTypeName, Vote } from 'state/types'
import { SingleVoteResults } from 'views/Voting/Proposal/ResultType/SingleVoteResults'
import { WeightedVoteResults } from 'views/Voting/Proposal/ResultType/WeightedVoteResults'
import TextEllipsis from '../components/TextEllipsis'

interface ResultsProps {
  proposal: Proposal
  choices: string[]
  votes: Vote[]
  votesLoadingStatus: TFetchStatus
}

const Results: React.FC<React.PropsWithChildren<ResultsProps>> = ({ proposal, choices, votes, votesLoadingStatus }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader style={{ background: 'transparent' }}>
        <Heading as="h3" scale="md">
          {t('Current Results')}
        </Heading>
      </CardHeader>
      <CardBody>
        {votesLoadingStatus === FetchStatus.Fetched && (
          <>
            {proposal.type === ProposalTypeName.SINGLE_CHOICE && <SingleVoteResults choices={choices} votes={votes} />}
            {proposal.type === ProposalTypeName.WEIGHTED && (
              <WeightedVoteResults
                sortData
                choices={choices}
                choicesVotes={choices.map((_, index) => ({ [index + 1]: proposal?.scores?.[index] ?? 0 }))}
              />
            )}
          </>
        )}

        {votesLoadingStatus === FetchStatus.Fetching &&
          choices.map((choice, index) => {
            return (
              <Box key={choice} mt={index > 0 ? '24px' : '0px'}>
                <Flex alignItems="center" mb="8px">
                  <TextEllipsis mb="4px" title={choice}>
                    {choice}
                  </TextEllipsis>
                </Flex>
                <Box mb="4px">
                  <Skeleton height="36px" mb="4px" />
                </Box>
              </Box>
            )
          })}
      </CardBody>
    </Card>
  )
}

export default Results
