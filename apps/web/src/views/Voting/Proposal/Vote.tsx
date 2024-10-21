import { useTranslation } from '@pancakeswap/localization'
import {
  Balance,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Flex,
  Heading,
  Image,
  Message,
  MessageText,
  Text,
  useModal,
  useToast,
  VoteIcon,
} from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useState } from 'react'
import { Proposal, ProposalState, ProposalTypeName } from 'state/types'
import { SingleVote } from 'views/Voting/Proposal/VoteType/SingleVote'
import { State } from 'views/Voting/Proposal/VoteType/types'
import { WeightedVote } from 'views/Voting/Proposal/VoteType/WeightedVote'
import { useAccount } from 'wagmi'
import CastVoteModal from '../components/CastVoteModal'

interface VoteProps extends CardProps {
  proposal: Proposal
  hasAccountVoted: boolean
  onSuccess?: () => void
}

const Vote: React.FC<React.PropsWithChildren<VoteProps>> = ({ proposal, hasAccountVoted, onSuccess, ...props }) => {
  const [vote, setVote] = useState<State>({
    label: '',
    value: 0,
  })
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { address: account } = useAccount()
  const { balance } = useVeCakeBalance()

  const handleSuccess = async () => {
    toastSuccess(t('Vote cast!'))
    onSuccess?.()
  }

  const [presentCastVoteModal] = useModal(
    <CastVoteModal
      proposalId={proposal.id}
      voteType={proposal.type}
      vote={vote}
      block={Number(proposal.snapshot)}
      onSuccess={handleSuccess}
    />,
  )

  return (
    <Card {...props}>
      <CardHeader style={{ background: 'transparent' }}>
        <Flex flexDirection={['column', 'column', 'row']}>
          <Heading as="h3" scale="md" mr="auto">
            {t('Cast your vote')}
          </Heading>
          <Flex alignItems="center">
            <Text>{t('veCake Balance')}:</Text>
            <Balance
              bold
              fontSize="20px"
              m="0 4px 0 8px"
              lineHeight="110%"
              decimals={2}
              value={getBalanceNumber(balance)}
            />
            <Image style={{ minWidth: '32px' }} width={32} height={32} src="/images/cake-staking/token-vecake.png" />
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        {proposal.type === ProposalTypeName.SINGLE_CHOICE && (
          <SingleVote proposal={proposal} vote={vote} setVote={setVote} />
        )}
        {proposal.type === ProposalTypeName.WEIGHTED && <WeightedVote proposal={proposal} />}
        {account ? (
          <>
            {hasAccountVoted ? (
              <Message variant="success" style={{ width: 'fit-content', margin: 'auto' }}>
                <MessageText>
                  {t('You cast your vote! Please wait until the voting ends to see the end results.')}
                </MessageText>
              </Message>
            ) : proposal.state === ProposalState.CLOSED ? (
              <Button m="auto" display="block" disabled>
                {t('Enter the votes to cast')}
              </Button>
            ) : (
              <Button
                m="auto"
                display="block"
                disabled={vote === null}
                endIcon={<VoteIcon width={14} height={14} color="white" />}
                onClick={presentCastVoteModal}
              >
                {t('Cast Vote')}
              </Button>
            )}
          </>
        ) : (
          <ConnectWalletButton />
        )}
      </CardBody>
    </Card>
  )
}

export default Vote
