import { Flex, LinkExternal, ScanLink, Text } from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import { Proposal, ProposalTypeName, Vote } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { IPFS_GATEWAY } from '../../config'
import TextEllipsis from '../TextEllipsis'
import Row, { AddressColumn, ChoiceColumn, VotingPowerColumn } from './Row'

const { VotedTag } = FarmWidget.Tags

interface VoteRowProps {
  vote: Vote
  proposal: Proposal
  isVoter: boolean
}

const VoteRow: React.FC<React.PropsWithChildren<VoteRowProps>> = ({ vote, proposal, isVoter }) => {
  const hasVotingPower = !!vote.metadata?.votingPower

  const votingPower = hasVotingPower
    ? parseFloat(vote.metadata?.votingPower || '0').toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })
    : '--'

  const displayText = useMemo(() => {
    if (proposal.type === ProposalTypeName.WEIGHTED) {
      const totalVotes = Object.values(vote.choice).reduce((sum, votes) => sum + votes, 0)
      const percentages = Object.entries(vote.choice).map(([key, value]) => {
        const percentage = ((value / totalVotes) * 100).toFixed(2)
        const choiceText = vote.proposal.choices[parseInt(key) - 1]
        return `${percentage}% for ${choiceText}`
      })

      return percentages.join(', ')
    }

    return vote.proposal.choices[vote.choice - 1]
  }, [proposal, vote])

  return (
    <Row>
      <AddressColumn>
        <Flex alignItems="center">
          <ScanLink useBscCoinFallback href={getBlockExploreLink(vote.voter, 'address')}>
            {truncateHash(vote.voter)}
          </ScanLink>
          {isVoter && <VotedTag mr="4px" />}
        </Flex>
      </AddressColumn>
      <ChoiceColumn>
        <TextEllipsis title={displayText}>{displayText}</TextEllipsis>
      </ChoiceColumn>
      <VotingPowerColumn>
        <Flex alignItems="center" justifyContent="end">
          <Text title={vote.metadata?.votingPower || '0'}>{votingPower}</Text>
          {hasVotingPower && <LinkExternal href={`${IPFS_GATEWAY}/${vote.ipfs}`} />}
        </Flex>
      </VotingPowerColumn>
    </Row>
  )
}

export default VoteRow
