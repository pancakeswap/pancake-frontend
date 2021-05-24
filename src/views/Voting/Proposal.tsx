import React, { useEffect, useState } from 'react'
import { ArrowBackIcon, Box, Button, Flex, Heading } from '@pancakeswap/uikit'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'
import ReactMarkdown from 'components/ReactMarkdown'
import PageLoader from 'components/PageLoader'
import { ProposalStateTag, ProposalTypeTag } from './components/Proposals/tags'
import { getProposal, isCoreProposal } from './helpers'
import { Proposal as ProposalType } from './types'

const Proposal = () => {
  const [proposal, setProposal] = useState<ProposalType | null>(null)
  const [notFound, setNotFound] = useState(false)
  const { id }: { id: string } = useParams()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchProposal = async () => {
      const response = await getProposal(id)

      if (response) {
        setProposal(response)
      } else {
        setNotFound(true)
      }
    }

    fetchProposal()
  }, [id, setProposal, setNotFound])

  if (notFound) {
    return <Redirect to="/voting" />
  }

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
    </Container>
  )
}

export default Proposal
