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
  Radio,
  Text,
  useModal,
  useToast,
  VoteIcon,
} from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useState } from 'react'
import { Proposal, ProposalState } from 'state/types'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import CastVoteModal from '../components/CastVoteModal'

interface VoteProps extends CardProps {
  proposal: Proposal
  hasAccountVoted: boolean
  onSuccess?: () => void
}

interface State {
  label: string
  value: number
}

const Choice = styled.label<{ isChecked: boolean; isDisabled: boolean }>`
  align-items: center;
  border: 1px solid ${({ theme, isChecked }) => theme.colors[isChecked ? 'success' : 'cardBorder']};
  border-radius: 16px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  margin-bottom: 16px;
  padding: 16px;
`

const ChoiceText = styled.div`
  flex: 1;
  padding-left: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 0;
`

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
        {proposal.choices.map((choice, index) => {
          const isChecked = index + 1 === vote.value

          const handleChange = () => {
            setVote({
              label: choice,
              value: index + 1,
            })
          }

          return (
            <Choice key={choice} isChecked={isChecked} isDisabled={!account}>
              <div style={{ flexShrink: 0 }}>
                <Radio
                  scale="sm"
                  value={choice}
                  checked={isChecked}
                  onChange={handleChange}
                  disabled={!account || proposal.state === ProposalState.CLOSED}
                />
              </div>
              <ChoiceText>
                <Text as="span" title={choice}>
                  {choice}
                </Text>
              </ChoiceText>
            </Choice>
          )
        })}
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
