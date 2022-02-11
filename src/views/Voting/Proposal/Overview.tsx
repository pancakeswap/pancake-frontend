import React from 'react'
import { ArrowBackIcon, Box, Button, Flex, Heading } from '@tovaswapui/uikit'
import { PageMeta } from 'components/Layout/Page'
import useSWR from 'swr'
import { getAllVotes } from 'state/voting/helpers'
import { useWeb3React } from '@web3-react/core'
import useSWRImmutable from 'swr/immutable'
import { ProposalState } from 'state/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import ReactMarkdown from 'components/ReactMarkdown'
import { FetchStatus } from 'config/constants/types'
import { isCoreProposal } from '../helpers'
import { ProposalStateTag, ProposalTypeTag } from '../components/Proposals/tags'
import Layout from '../components/Layout'
import Details from './Details'
import Results from './Results'
import Vote from './Vote'
import Votes from './Votes'

const Overview = () => {
  const id = useRouter().query.id as string
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const { status: proposalLoadingStatus, data: proposal } = useSWRImmutable(['proposal', id])
  const { id: proposalId = null, snapshot = null } = proposal ?? {}

  const {
    status: votesLoadingStatus,
    data: votes,
    mutate: refetch,
  } = useSWR(proposalId && snapshot ? ['proposal', proposalId, 'votes'] : null, async () =>
    getAllVotes(proposalId, Number(snapshot)),
  )
  const hasAccountVoted = account && votes && votes.some((vote) => vote.voter.toLowerCase() === account.toLowerCase())

  const isPageLoading = votesLoadingStatus === FetchStatus.Fetching || proposalLoadingStatus === FetchStatus.Fetching

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="40px">
        <Link href="/voting" passHref>
          <Button as="a" variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
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
          {!isPageLoading && !hasAccountVoted && proposal.state === ProposalState.ACTIVE && (
            <Vote proposal={proposal} onSuccess={refetch} mb="16px" />
          )}
          <Votes votes={votes} votesLoadingStatus={votesLoadingStatus} />
        </Box>
        <Box>
          <Details proposal={proposal} />
          <Results choices={proposal.choices} votes={votes} votesLoadingStatus={votesLoadingStatus} />
        </Box>
      </Layout>
    </Container>
  )
}

export default Overview
