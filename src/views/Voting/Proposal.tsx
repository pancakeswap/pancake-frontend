import React, { useEffect, useState } from 'react'
import { ArrowBackIcon, Box, Button, Flex, Heading } from '@pancakeswap/uikit'
import Container from 'components/layout/Container'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
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
    return <div>loading...</div>
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
      <Heading as="h1" scale="xl">
        {proposal.title}
      </Heading>
    </Container>
  )
}

export default Proposal
