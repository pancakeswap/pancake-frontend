import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowForwardIcon, Box, IconButton, Flex, LinkExternal, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Proposal } from '../../types'
import { IPFS_GATEWAY } from '../../config'
import { isCoreProposal } from '../../helpers'
import TimeFrame from './TimeFrame'
import { ProposalStateTag, ProposalTypeTag } from './tags'

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
  const { t } = useTranslation()
  const proposalIpfsLink = `${IPFS_GATEWAY}/${proposal.id}`
  const votingLink = `/voting/${proposal.id}`

  return (
    <StyledProposalRow>
      <Box style={{ flex: 1 }}>
        <TitleLink to={votingLink}>{proposal.title}</TitleLink>
        <Flex alignItems="center" mb="8px">
          <LinkExternal href={proposalIpfsLink}>{`#${proposal.id.slice(0, 8)}`}</LinkExternal>
          <TimeFrame startDate={proposal.start} endDate={proposal.end} proposalState={proposal.state} />
        </Flex>
        <Flex alignItems="center">
          <ProposalStateTag proposalState={proposal.state} />
          <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} ml="8px" />
          <Text fontSize="14px" color="textSubtle" ml="8px">
            {`${t('Creator')}:`}
          </Text>
          <LinkExternal href={`https://bscscan.com/address/${proposal.author}`} ml="8px">
            {proposal.author.slice(0, 8)}
          </LinkExternal>
        </Flex>
      </Box>
      <IconButton as={Link} to={votingLink}>
        <ArrowForwardIcon width="24px" />
      </IconButton>
    </StyledProposalRow>
  )
}

export default ProposalRow
