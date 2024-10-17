import { useTranslation } from '@pancakeswap/localization'
import {
  AutoRenewIcon,
  Button,
  Card,
  CardHeader,
  ChevronDownIcon,
  ChevronUpIcon,
  Flex,
  Heading,
} from '@pancakeswap/uikit'
import { FetchStatus, TFetchStatus } from 'config/constants/types'
import { useCallback } from 'react'
import { Vote } from 'state/types'
import { useAccount } from 'wagmi'
import VoteRow from '../components/Proposal/VoteRow'
import VotesLoading from '../components/Proposal/VotesLoading'

interface VotesProps {
  votes: Vote[]
  showAll: boolean
  setShowAll: (value: ((prevState: boolean) => boolean) | boolean) => void
  totalVotes?: number
  votesLoadingStatus: TFetchStatus
}

const Votes: React.FC<React.PropsWithChildren<VotesProps>> = ({
  votes,
  showAll,
  setShowAll,
  votesLoadingStatus,
  totalVotes,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  const isFetched = votesLoadingStatus === FetchStatus.Fetched

  const handleClick = useCallback(() => {
    setShowAll((prevShowAll) => !prevShowAll)
  }, [setShowAll])

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

      {isFetched && votes.length > 0 && (
        <>
          {votes.map((vote) => {
            const isVoter = account && vote.voter.toLowerCase() === account.toLowerCase()
            return <VoteRow key={vote.id} vote={vote} isVoter={Boolean(isVoter)} />
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

      {isFetched && votes.length === 0 && (
        <Flex alignItems="center" justifyContent="center" py="32px">
          <Heading as="h5">{t('No votes found')}</Heading>
        </Flex>
      )}
    </Card>
  )
}

export default Votes
