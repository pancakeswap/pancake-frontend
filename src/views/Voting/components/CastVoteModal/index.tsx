import React, { useState } from 'react'
import { Box, Modal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { SnapshotCommand } from 'state/types'
import useToast from 'hooks/useToast'
import useWeb3Provider from 'hooks/useWeb3Provider'
import useTheme from 'hooks/useTheme'
import { CastVoteModalProps, ConfirmVoteView } from './types'
import MainView from './MainView'
import DetailsView from './DetailsView'
import { generatePayloadData, Message, sendSnaphotData } from '../../helpers'
import useGetVotingPower from '../../hooks/useGetVotingPower'

const CastVoteModal: React.FC<CastVoteModalProps> = ({ onSuccess, proposalId, vote, block, onDismiss }) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const provider = useWeb3Provider()
  const { theme } = useTheme()
  const {
    isLoading,
    total,
    cakeBalance,
    cakeVaultBalance,
    cakePoolBalance,
    poolsBalance,
    cakeBnbLpBalance,
    verificationHash,
  } = useGetVotingPower(block, modalIsOpen)

  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? null : () => setView(ConfirmVoteView.MAIN)
  const handleViewDetails = () => setView(ConfirmVoteView.DETAILS)

  const title = {
    [ConfirmVoteView.MAIN]: t('Confirm Vote'),
    [ConfirmVoteView.DETAILS]: t('Voting Power'),
  }

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

      const sig = await provider.getSigner().signMessage(voteMsg)
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
    <Modal
      title={title[view]}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Box mb="24px" width="320px">
        {view === ConfirmVoteView.MAIN && (
          <MainView
            vote={vote}
            isLoading={isLoading}
            isPending={isPending}
            total={total}
            onConfirm={handleConfirmVote}
            onViewDetails={handleViewDetails}
            onDismiss={handleDismiss}
          />
        )}
        {view === ConfirmVoteView.DETAILS && (
          <DetailsView
            total={total}
            cakeBalance={cakeBalance}
            cakeVaultBalance={cakeVaultBalance}
            cakePoolBalance={cakePoolBalance}
            poolsBalance={poolsBalance}
            cakeBnbLpBalance={cakeBnbLpBalance}
          />
        )}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
