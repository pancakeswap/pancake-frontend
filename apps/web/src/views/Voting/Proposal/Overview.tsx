import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowBackIcon,
  Box,
  Button,
  Flex,
  Heading,
  NotFound,
  ReactMarkdown,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import Container from 'components/Layout/Container'
import PageLoader from 'components/Loader/PageLoader'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { ProposalState, Vote as VoteType } from 'state/types'
import { getAllVotes, getNumberOfVotes, getProposal } from 'state/voting/helpers'
import { useAccount } from 'wagmi'
import Layout from '../components/Layout'
import { ProposalStateTag, ProposalTypeTag } from '../components/Proposals/tags'
import { isCoreProposal } from '../helpers'
import Details from './Details'
import Results from './Results'
import Vote from './Vote'
import Votes from './Votes'

const Overview = () => {
  const { query, isFallback } = useRouter()
  const id = query.id as string
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const queryClient = useQueryClient()
  const [showAllVotes, setShowAllVotes] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const VOTES_PER_VIEW = isMobile ? 10 : 20

  const {
    status: proposalLoadingStatus,
    data: proposal,
    refetch: refetchProposal,
    error,
  } = useQuery({
    queryKey: ['voting', 'proposal', id],
    queryFn: () => getProposal(id),
    enabled: Boolean(id),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const { status: votesLoadingStatus, data: votes = [] } = useQuery({
    queryKey: ['voting', 'proposal', proposal, showAllVotes ? 'allVotes' : 'overviewVotes'],
    queryFn: async () => {
      if (!proposal) {
        throw new Error('No proposal')
      }
      if (showAllVotes) {
        if (proposal.votes > VOTES_PER_VIEW) {
          return getAllVotes(proposal)
        }
        const cachedOverviewVotes = queryClient.getQueryCache().find<VoteType[]>({
          queryKey: ['voting', 'proposal', proposal?.id, 'overviewVotes'],
        })?.state?.data
        if (cachedOverviewVotes) {
          return cachedOverviewVotes
        }
      }
      return getNumberOfVotes(proposal, VOTES_PER_VIEW)
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(proposal),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const { data: accountVoteChoice } = useQuery({
    queryKey: ['voting', 'proposal', proposal, account, 'accountVoteChoice'],
    queryFn: async () => {
      if (!proposal) {
        throw new Error('No proposal')
      }
      const voteInVotes = votes.filter((vote) => vote.voter.toLowerCase() === account?.toLowerCase())[0]
      return voteInVotes?.choice ?? (await getNumberOfVotes(proposal, 1, account))[0]?.choice
    },
    enabled: Boolean(account && proposal && votesLoadingStatus === 'success'),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const handleSuccess = useCallback(() => {
    refetchProposal()
  }, [refetchProposal])

  const isPageLoading = votesLoadingStatus === 'pending' || proposalLoadingStatus === 'pending'

  if (!proposal && error) {
    return (
      <NotFound LinkComp={Link}>
        <NextSeo title="404" />
      </NotFound>
    )
  }

  if (isFallback || !proposal) {
    return <PageLoader />
  }

  return (
    <Container py="40px">
      <Box mb="40px">
        <Link href="/voting" passHref>
          <Button variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
            {t('Back to Vote Overview')}
          </Button>
        </Link>
      </Box>
      <Layout>
        <Box>
          <Box mb="32px">
            <Flex alignItems="center" mb="8px">
              <ProposalStateTag proposalState={proposal.state} />
              <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} ml="8px" />
            </Flex>
            <Heading as="h1" scale="xl" mb="16px">
              {proposal.title}
            </Heading>
            <Box>
              <ReactMarkdown>{proposal.body}</ReactMarkdown>
            </Box>
          </Box>
          {!isPageLoading && !accountVoteChoice && proposal.state === ProposalState.ACTIVE && (
            <Vote proposal={proposal} onSuccess={handleSuccess} mb="16px" />
          )}
          <Votes
            votes={votes}
            showAll={showAllVotes}
            setShowAll={setShowAllVotes}
            totalVotes={proposal.votes}
            votesLoadingStatus={votesLoadingStatus}
          />
        </Box>
        <Box position="sticky" top="60px">
          <Details proposal={proposal} />
          <Results
            choices={proposal.choices}
            accountVoteChoice={accountVoteChoice}
            choiceVotesScores={proposal.scores}
            totalVotesScores={proposal.scores_total}
          />
        </Box>
      </Layout>
    </Container>
  )
}

export default Overview
