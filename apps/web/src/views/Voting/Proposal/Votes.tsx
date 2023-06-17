import { useState } from 'react'
import {
  AutoRenewIcon,
  Card,
  CardHeader,
  ChevronDownIcon,
  Flex,
  Heading,
  Button,
  ChevronUpIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import orderBy from 'lodash/orderBy'
import { useTranslation } from '@pancakeswap/localization'
import { Vote } from 'state/types'
import { FetchStatus, TFetchStatus } from 'config/constants/types'
import VotesLoading from '../components/Proposal/VotesLoading'
import VoteRow from '../components/Proposal/VoteRow'

interface VotesProps {
  votes: Vote[]
  totalVotes?: number
  votesLoadingStatus: TFetchStatus
}

const parseVotePower = (incomingVote: Vote) => {
  let votingPower = parseFloat(incomingVote?.metadata?.votingPower)
  if (!votingPower) votingPower = 0
  return votingPower
}

const Votes: React.FC<React.PropsWithChildren<VotesProps>> = ({ votes, votesLoadingStatus, totalVotes }) => {
  const [showAll, setShowAll] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const orderedVotes = orderBy(votes, [parseVotePower, 'created'], ['desc', 'desc'])

  const VOTES_PER_VIEW = isMobile ? 10 : 20
  const displayVotes = showAll ? orderedVotes : orderedVotes.slice(0, VOTES_PER_VIEW)
  const isFetched = votesLoadingStatus === FetchStatus.Fetched

  const handleClick = () => {
    setShowAll(!showAll)
  }

  return (
    <Card>
      <CardHeader>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading as="h3" scale="md">
            {t('Votes (%count%)', { count: totalVotes || '-' })}
          </Heading>
          {!isFetched && <AutoRenewIcon spin width="22px" />}
        </Flex>
      </CardHeader>
      {!isFetched && <VotesLoading />}

      {isFetched && displayVotes.length > 0 && (
        <>
          {displayVotes.map((vote) => {
            const isVoter = account && vote.voter.toLowerCase() === account.toLowerCase()
            return <VoteRow key={vote.id} vote={vote} isVoter={isVoter} />
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
              disabled={!isFetched}
            >
              {showAll ? t('Hide') : t('See All')}
            </Button>
          </Flex>
        </>
      )}

      {isFetched && displayVotes.length === 0 && (
        <Flex alignItems="center" justifyContent="center" py="32px">
          <Heading as="h5">{t('No votes found')}</Heading>
        </Flex>
      )}
    </Card>
  )
}

export default Votes
