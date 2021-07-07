import React, { useEffect } from 'react'
import { ArrowBackIcon, Box, Button, Flex, Heading } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch } from 'state'
import { ProposalState, VotingStateLoadingStatus } from 'state/types'
import { useGetProposal, useGetVotingStateLoadingStatus, useGetVotes, useGetProposalLoadingStatus } from 'state/hooks'
import { fetchProposal, fetchVotes } from 'state/voting'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import ReactMarkdown from 'components/ReactMarkdown'
import PageLoader from 'components/PageLoader'
import { isCoreProposal } from '../helpers'
import { ProposalStateTag, ProposalTypeTag } from '../components/Proposals/tags'
import Layout from '../components/Layout'
import Details from './Details'
import Results from './Results'
import Vote from './Vote'
import Votes from './Votes'

const Proposal = () => {
  const { id }: { id: string } = useParams()
  const proposal = useGetProposal(id)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const votes = useGetVotes(id)
  const voteLoadingStatus = useGetVotingStateLoadingStatus()
  const proposalLoadingStatus = useGetProposalLoadingStatus()
  const hasAccountVoted = account && votes.some((vote) => vote.voter.toLowerCase() === account.toLowerCase())
  const { id: proposalId = null, snapshot = null } = proposal ?? {}
  const isPageLoading =
    voteLoadingStatus === VotingStateLoadingStatus.LOADING || proposalLoadingStatus === VotingStateLoadingStatus.LOADING

  useEffect(() => {
    dispatch(fetchProposal(id))
  }, [id, dispatch])

  // We have to wait for the proposal to load before fetching the votes because we need to include the snapshot
  useEffect(() => {
    if (proposalId && snapshot) {
      dispatch(fetchVotes({ proposalId, block: Number(snapshot) }))
    }
  }, [proposalId, snapshot, dispatch])

  if (!proposal) {
    return <PageLoader />
  }

  return (
    <Container py="40px">
      <Box mb="40px">
        <Button as={Link} to="/voting" variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
          {t('Back to Vote Overview')}
        </Button>
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
            <Vote proposal={proposal} mb="16px" />
          )}
          <Votes votes={votes} />
        </Box>
        <Box>
          <Details proposal={proposal} />
          <Results choices={proposal.choices} votes={votes} />
        </Box>
      </Layout>
    </Container>
  )
}

export default Proposal
