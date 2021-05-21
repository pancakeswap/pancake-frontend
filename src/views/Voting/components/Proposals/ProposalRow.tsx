import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowForwardIcon, Box, IconButton, Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Proposal } from '../../types'
import { isCoreProposal } from '../../helpers'
import TimeFrame from './TimeFrame'
import { ProposalStateTag, ProposalTypeTag } from './tags'

interface ProposalRowProps {
  proposal: Proposal
}

const StyledProposalRow = styled(Link)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  display: flex;
  padding: 16px 24px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`

const ProposalRow: React.FC<ProposalRowProps> = ({ proposal }) => {
  const { t } = useTranslation()
  const votingLink = `/voting/${proposal.id}`

  return (
    <StyledProposalRow to={votingLink}>
      <Box style={{ flex: 1 }}>
        <Text bold mb="8px">
          {proposal.title}
        </Text>
        <Flex alignItems="center" mb="8px">
          <TimeFrame startDate={proposal.start} endDate={proposal.end} proposalState={proposal.state} />
        </Flex>
        <Flex alignItems="center">
          <ProposalStateTag proposalState={proposal.state} />
          <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} ml="8px" />
          <Text fontSize="14px" color="textSubtle" ml="8px">
            {`${t('Creator')}:`}
          </Text>
          <Text bold ml="8px" fontSize="14px">
            {proposal.author.slice(0, 8)}
          </Text>
        </Flex>
      </Box>
      <IconButton as={Link} to={votingLink}>
        <ArrowForwardIcon width="24px" />
      </IconButton>
    </StyledProposalRow>
  )
}

export default ProposalRow
