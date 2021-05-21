import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Flex, LinkExternal } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Proposal } from '../../types'
import { IPFS_GATEWAY } from '../../config'
import TimeFrame from './TimeFrame'
import { ProposalStateTag } from './tags'

interface ProposalRowProps {
  proposal: Proposal
}

const TitleLink = styled(Link)`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
`

const StyledProposalRow = styled(Flex)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding: 16px 24px;
`

const ProposalRow: React.FC<ProposalRowProps> = ({ proposal }) => {
  const proposalIpfsLink = `${IPFS_GATEWAY}/${proposal.id}`

  return (
    <StyledProposalRow>
      <Box style={{ flex: 1 }}>
        <TitleLink to={`/voting/${proposal.id}`}>{proposal.title}</TitleLink>
        <Flex alignItems="center" mb="8px">
          <LinkExternal href={proposalIpfsLink}>{`#${proposal.id.slice(0, 8)}`}</LinkExternal>
          <TimeFrame startDate={proposal.start} endDate={proposal.end} proposalState={proposal.state} />
        </Flex>
        <Flex alignItems="center">
          <ProposalStateTag proposalState={proposal.state} />
        </Flex>
      </Box>
    </StyledProposalRow>
  )
}

export default ProposalRow
