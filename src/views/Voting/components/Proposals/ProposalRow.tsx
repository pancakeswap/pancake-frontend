import { ArrowForwardIcon, Box, IconButton, Flex, Text, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Proposal } from 'state/types'
import { isCoreProposal } from '../../helpers'
import TimeFrame from './TimeFrame'
import { ProposalStateTag, ProposalTypeTag } from './tags'

interface ProposalRowProps {
  proposal: Proposal
}

const StyledProposalRow = styled(NextLinkFromReactRouter)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 16px 24px;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`

const ProposalRow: React.FC<React.PropsWithChildren<ProposalRowProps>> = ({ proposal }) => {
  const votingLink = `/voting/proposal/${proposal.id}`

  return (
    <StyledProposalRow to={votingLink}>
      <Box as="span" style={{ flex: 1 }}>
        <Text bold mb="8px">
          {proposal.title}
        </Text>
        <Flex alignItems="center" mb="8px">
          <TimeFrame startDate={proposal.start} endDate={proposal.end} proposalState={proposal.state} />
        </Flex>
        <Flex alignItems="center">
          <ProposalStateTag proposalState={proposal.state} />
          <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} ml="8px" />
        </Flex>
      </Box>
      <IconButton variant="text">
        <ArrowForwardIcon width="24px" />
      </IconButton>
    </StyledProposalRow>
  )
}

export default ProposalRow
