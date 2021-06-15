import React, { useEffect } from 'react'
import { ArrowBackIcon, Box, Button, Flex, Heading } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch } from 'state'
import { ProposalState } from 'state/types'
import { useGetProposal, useGetVotes } from 'state/hooks'
import { fetchProposal, fetchVotes } from 'state/voting'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'
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
  const hasAccountVoted = account && votes.some((vote) => vote.voter.toLowerCase() === account.toLowerCase())

  useEffect(() => {
    dispatch(fetchProposal(id))
    dispatch(fetchVotes(id))
  }, [id, dispatch])

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
          {!hasAccountVoted && account && proposal.state === ProposalState.ACTIVE && (
            <Vote proposal={proposal} mb="16px" />
          )}
          <Votes votes={votes} />
        </Box>
        <Box>
          <Details proposal={proposal} />
          <Results choiceCount={proposal.choices.length} votes={votes} />
        </Box>
      </Layout>
    </Container>
  )
}

export default Proposal
