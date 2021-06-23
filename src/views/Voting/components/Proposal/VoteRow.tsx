import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, LinkExternal, Text } from '@pancakeswap/uikit'
import truncateWalletAddress from 'utils/truncateWalletAddress'
import { getBscScanAddressUrl } from 'utils/bscscan'
import { Vote } from 'state/types'
import { IPFS_GATEWAY } from '../../config'
import TextEllipsis from '../TextEllipsis'
import Row, { AddressColumn, ChoiceColumn, VotingPowerColumn } from './Row'

interface VoteRowProps {
  vote: Vote
}

const VoteRow: React.FC<VoteRowProps> = ({ vote }) => {
  const hasVotingPower = !!vote.metadata?.votingPower
  const votingPower = hasVotingPower ? new BigNumber(vote.metadata.votingPower).toFormat(3) : '--'

  return (
    <Row>
      <AddressColumn>
        <LinkExternal href={getBscScanAddressUrl(vote.voter)}>{truncateWalletAddress(vote.voter)}</LinkExternal>
      </AddressColumn>
      <ChoiceColumn>
        <TextEllipsis title={vote.proposal.choices[vote.choice - 1]}>
          {vote.proposal.choices[vote.choice - 1]}
        </TextEllipsis>
      </ChoiceColumn>
      <VotingPowerColumn>
        <Flex alignItems="center" justifyContent="end">
          <Text title={vote.metadata.votingPower}>{votingPower}</Text>
          {hasVotingPower && <LinkExternal href={`${IPFS_GATEWAY}/${vote.id}`} />}
        </Flex>
      </VotingPowerColumn>
    </Row>
  )
}

export default VoteRow
