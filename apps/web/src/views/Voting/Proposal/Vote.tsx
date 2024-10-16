import { useTranslation } from '@pancakeswap/localization'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Heading,
  Radio,
  Text,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useState } from 'react'
import { Proposal } from 'state/types'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import CastVoteModal from '../components/CastVoteModal'

interface VoteProps extends CardProps {
  proposal: Proposal
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

const Vote: React.FC<React.PropsWithChildren<VoteProps>> = ({ proposal, onSuccess, ...props }) => {
  const [vote, setVote] = useState<State>({
    label: '',
    value: 0,
  })
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { address: account } = useAccount()

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
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Cast your vote')}
        </Heading>
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
                <Radio scale="sm" value={choice} checked={isChecked} onChange={handleChange} disabled={!account} />
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
          <Button onClick={presentCastVoteModal} disabled={vote === null}>
            {t('Cast Vote')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </CardBody>
    </Card>
  )
}

export default Vote
