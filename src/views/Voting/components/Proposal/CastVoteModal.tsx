import React, { useState } from 'react'
import { AutoRenewIcon, Box, Button, InjectedModalProps, Modal, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import useWeb3 from 'hooks/useWeb3'
import { SnapshotCommand } from 'state/types'
import useGetVotingPower from '../../hooks/useGetVotingPower'
import { generatePayloadData, Message, sendSnaphotData } from '../../helpers'
import ModalBox from './ModalBox'

interface CastVoteModalProps extends InjectedModalProps {
  onSuccess: () => Promise<void>
  proposalId: string
  vote: {
    label: string
    value: number
  }
  block?: number
}

const CastVoteModal: React.FC<CastVoteModalProps> = ({ onSuccess, proposalId, vote, block, onDismiss }) => {
  const { t } = useTranslation()
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const { isLoading, total, verificationHash } = useGetVotingPower(block, modalIsOpen)
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { toastError } = useToast()

  const handleDismiss = () => {
    setModalIsOpen(false)
    onDismiss()
  }

  const handleConfirmVote = async () => {
    try {
      setIsPending(true)
      const voteMsg = JSON.stringify({
        ...generatePayloadData(),
        type: SnapshotCommand.VOTE,
        payload: {
          proposal: proposalId,
          choice: vote.value,
          metadata: {
            votingPower: total.toString(),
            verificationHash,
          },
        },
      })
      const sig = await web3.eth.personal.sign(voteMsg, account, null)
      const msg: Message = { address: account, msg: voteMsg, sig }

      // Save proposal to snapshot
      await sendSnaphotData(msg)
      setIsPending(false)

      await onSuccess()

      handleDismiss()
    } catch (error) {
      setIsPending(false)
      toastError(t('Error'), error?.message)
      console.error(error)
    }
  }

  return (
    <Modal title={t('Confirm Vote')} onDismiss={handleDismiss}>
      <Box mb="24px" width="320px">
        <Text color="secondary" mb="8px" textTransform="uppercase" fontSize="12px" bold>
          {t('Voting For')}
        </Text>
        <Text bold fontSize="20px" mb="8px">
          {vote.label}
        </Text>
        <Text color="secondary" mb="8px" textTransform="uppercase" fontSize="12px" bold>
          {t('Your Voting Power')}
        </Text>
        {isLoading ? (
          <>
            <Text fontSize="14px" color="textSubtle" mb="8px">
              {t('Please wait while we calculate your voting power')}
            </Text>
            <Skeleton height="64px" mb="24px" />
          </>
        ) : (
          <ModalBox>
            <Text bold fontSize="20px">
              {total.toFixed(2)}
            </Text>
          </ModalBox>
        )}
        <Text as="p" color="textSubtle" fontSize="14px">
          {t('Are you sure you want to vote for the above choice? This action cannot be undone.')}
        </Text>
      </Box>
      <Button
        isLoading={isPending}
        endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
        disabled={isLoading || total.eq(0)}
        width="100%"
        mb="8px"
        onClick={handleConfirmVote}
      >
        {t('Confirm Vote')}
      </Button>
      <Button variant="secondary" width="100%" onClick={handleDismiss}>
        {t('Cancel')}
      </Button>
    </Modal>
  )
}

export default CastVoteModal
