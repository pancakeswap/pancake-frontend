import { Flex, LinkExternal, Text, Tag, CheckmarkCircleIcon } from '@pancakeswap/uikit'
import truncateHash from 'utils/truncateHash'
import { getBscScanLink } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { Vote } from 'state/types'
import { IPFS_GATEWAY } from '../../config'
import TextEllipsis from '../TextEllipsis'
import Row, { AddressColumn, ChoiceColumn, VotingPowerColumn } from './Row'

interface VoteRowProps {
  vote: Vote
  isVoter: boolean
}

const VoteRow: React.FC<React.PropsWithChildren<VoteRowProps>> = ({ vote, isVoter }) => {
  const { t } = useTranslation()
  const hasVotingPower = !!vote.metadata?.votingPower

  const votingPower = hasVotingPower
    ? parseFloat(vote.metadata.votingPower).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })
    : '--'

  return (
    <Row>
      <AddressColumn>
        <Flex alignItems="center">
          <LinkExternal href={getBscScanLink(vote.voter, 'address')}>{truncateHash(vote.voter)}</LinkExternal>
          {isVoter && (
            <Tag variant="success" outline ml="8px">
              <CheckmarkCircleIcon mr="4px" /> {t('Voted')}
            </Tag>
          )}
        </Flex>
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
