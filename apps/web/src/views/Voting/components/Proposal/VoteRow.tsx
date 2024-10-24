import { Flex, LinkExternal, ScanLink, Text, useTooltip } from '@pancakeswap/uikit'
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

  const percentages = useMemo(() => {
    const totalVotes = Object.values(vote.choice).reduce((sum, votes) => sum + votes, 0)
    const percentagesArray = Object.entries(vote.choice).map(([key, value]) => {
      const percentage = ((value / totalVotes) * 100).toFixed(2)
      const choiceText = vote.proposal.choices[parseInt(key) - 1]
      return { choiceText, percentage }
    })

    return percentagesArray
  }, [vote])

  const displayText = useMemo(() => {
    if (proposal.type === ProposalTypeName.WEIGHTED) {
      const weightedData = percentages
        .filter((j) => j.percentage !== '0.00')
        .map((i) => `${i.percentage}% for ${i.choiceText}`)
      return weightedData.join(', ')
    }

    return vote.proposal.choices[vote.choice - 1]
  }, [percentages, proposal, vote])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      {proposal.type === ProposalTypeName.WEIGHTED ? (
        <Flex flexDirection="column">
          {percentages
            .filter((j) => j.percentage !== '0.00')
            .map((i) => (
              <Text fontSize="14px">{`${i.choiceText} - ${i.percentage}%`}</Text>
            ))}
        </Flex>
      ) : (
        <Text fontSize="14px">{vote.proposal.choices[vote.choice - 1]}</Text>
      )}
    </>,
    { placement: 'top' },
  )

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
      <ChoiceColumn ref={targetRef}>
        <TextEllipsis title={displayText}>{displayText}</TextEllipsis>
        {tooltipVisible && tooltip}
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
