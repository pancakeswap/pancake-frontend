import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, LinkExternal, Text } from '@pancakeswap/uikit'
import truncateWalletAddress from 'utils/truncateWalletAddress'
import { formatNumber } from 'utils/formatBalance'
import { getBscScanAddressUrl } from 'utils/bscscan'
import { Vote } from '../../types'
import { IPFS_GATEWAY } from '../../config'
import Row, { AddressColumn, ChoiceColumn, VotingPowerColumn } from './Row'

interface VoteRowProps {
  vote: Vote
}

const VoteRow: React.FC<VoteRowProps> = ({ vote }) => {
  const hasVotingPower = !!vote.metadata?.votingPower
  const votingPower = hasVotingPower ? formatNumber(new BigNumber(vote.metadata.votingPower).toNumber(), 0, 2) : '--'

  return (
    <Row>
      <AddressColumn>
        <LinkExternal href={getBscScanAddressUrl(vote.voter)}>{truncateWalletAddress(vote.voter)}</LinkExternal>
      </AddressColumn>
      <ChoiceColumn>
        <Text>{vote.proposal.choices[vote.choice - 1]}</Text>
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
