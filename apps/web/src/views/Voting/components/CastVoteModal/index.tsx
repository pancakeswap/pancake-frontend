import { useTranslation } from '@pancakeswap/localization'
import { Box, Modal, useToast } from '@pancakeswap/uikit'
import snapshot from '@snapshot-labs/snapshot.js'
import { useState } from 'react'
import { ProposalTypeName } from 'state/types'
import { PANCAKE_SPACE } from 'views/Voting/config'
import { VECAKE_VOTING_POWER_BLOCK } from 'views/Voting/helpers'
import { SingleVoteState, WeightedVoteState } from 'views/Voting/Proposal/VoteType/types'
import { useAccount, useWalletClient } from 'wagmi'
import useGetVotingPower from '../../hooks/useGetVotingPower'
import DetailsView from './DetailsView'
import MainView, { VeMainView } from './MainView'
import { CastVoteModalProps, ConfirmVoteView } from './types'

const hub = 'https://hub.snapshot.org'
const client = new snapshot.Client712(hub)

const CastVoteModal: React.FC<React.PropsWithChildren<CastVoteModalProps>> = ({
  proposal,
  onSuccess,
  proposalId,
  vote,
  block,
  voteType,
  onDismiss,
}) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [isPending, setIsPending] = useState(false)
  const { address: account } = useAccount()
  const { data: signer } = useWalletClient()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const {
    isLoading,
    isError,
    total,
    cakeBalance,
    cakeVaultBalance,
    cakePoolBalance,
    poolsBalance,
    cakeBnbLpBalance,
    ifoPoolBalance,
    lockedCakeBalance,
    lockedEndTime,
    veCakeBalance,
  } = useGetVotingPower(block)

  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? undefined : () => setView(ConfirmVoteView.MAIN)
  const handleViewDetails = () => setView(ConfirmVoteView.DETAILS)

  const title = {
    [ConfirmVoteView.MAIN]: t('Confirm Vote'),
    [ConfirmVoteView.DETAILS]: t('Voting Power'),
  }

  const handleDismiss = () => {
    onDismiss?.()
  }

  const handleConfirmVote = async () => {
    try {
      setIsPending(true)
      const web3 = {
        getSigner: () => {
          return {
            _signTypedData: (domain, types, message) =>
              signer?.signTypedData({
                account,
                domain,
                types,
                message,
                primaryType: 'Vote',
              }),
          }
        },
      }

      if (!account) {
        return
      }

      await client.vote(web3 as any, account, {
        space: PANCAKE_SPACE,
        choice:
          voteType === ProposalTypeName.SINGLE_CHOICE ? (vote as SingleVoteState).value : (vote as WeightedVoteState),
        reason: '',
        type: voteType,
        proposal: proposalId,
        app: 'snapshot',
      })

      await onSuccess()

      handleDismiss()
    } catch (error) {
      toastError(t('Error'), (error as Error)?.message ?? t('Error occurred, please try again'))
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      title={title[view]}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      headerBorderColor="transparent"
    >
      <Box mb="24px">
        {view === ConfirmVoteView.MAIN &&
          (block && BigInt(block) >= VECAKE_VOTING_POWER_BLOCK ? (
            <VeMainView
              block={block}
              vote={vote}
              proposal={proposal}
              voteType={voteType}
              total={total}
              isPending={isPending}
              isLoading={isLoading}
              isError={isError}
              veCakeBalance={veCakeBalance}
              onConfirm={handleConfirmVote}
              onDismiss={handleDismiss}
            />
          ) : (
            <MainView
              vote={vote}
              voteType={voteType}
              isError={isError}
              proposal={proposal}
              isLoading={isLoading}
              isPending={isPending}
              total={total}
              lockedCakeBalance={Number(lockedCakeBalance)}
              lockedEndTime={Number(lockedEndTime)}
              onConfirm={handleConfirmVote}
              onViewDetails={handleViewDetails}
              onDismiss={handleDismiss}
            />
          ))}
        {view === ConfirmVoteView.DETAILS && block && (
          <DetailsView
            total={total}
            cakeBalance={cakeBalance}
            ifoPoolBalance={ifoPoolBalance}
            cakeVaultBalance={cakeVaultBalance}
            cakePoolBalance={cakePoolBalance}
            poolsBalance={poolsBalance}
            cakeBnbLpBalance={cakeBnbLpBalance}
            block={block}
            lockedCakeBalance={lockedCakeBalance}
            lockedEndTime={lockedEndTime}
          />
        )}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
