import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, InfoIcon, Text, useModal, useToast, useTooltip } from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { useQuestRewardContract } from 'hooks/useContract'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useCallback, useMemo } from 'react'
import { styled } from 'styled-components'
import { Address, encodePacked, getAddress, isAddress, keccak256, toHex } from 'viem'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { GetMerkleProofResponse } from 'views/Quest/components/Reward'
import { MessageInfo } from 'views/Quest/components/Reward/MessageInfo'
import { SuccessClaimedModal } from 'views/Quest/components/Reward/SuccessClaimedModal'

const StyledButton = styled(Button)<{ $outline?: boolean }>`
  width: 100%;
  margin: 8px 0;
  border-radius: 24px;

  ${({ $outline }) =>
    $outline &&
    `
      background-color: transparent !important;
  `}
`

interface ClaimButtonProps {
  quest: SingleQuestData
  isTasksCompleted: boolean
  isQuestFinished: boolean
  proofData: null | GetMerkleProofResponse
  ableToClaimReward: boolean
  refreshProofData: () => void
}

export const ClaimButton: React.FC<ClaimButtonProps> = ({
  quest,
  isTasksCompleted,
  isQuestFinished,
  proofData,
  ableToClaimReward,
  refreshProofData,
}) => {
  const { t } = useTranslation()
  const { id } = quest
  const { account, chainId } = useActiveWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = useQuestRewardContract(quest.reward?.currency?.network as ChainId)
  const { switchNetworkAsync } = useSwitchNetwork()

  const rewardClaimingId = useMemo(
    () =>
      id && isAddress(quest.ownerAddress)
        ? keccak256(encodePacked(['bytes32', 'address'], [toHex(id), getAddress(quest.ownerAddress) as Address]))
        : undefined,
    [quest.ownerAddress, id],
  )

  const { data: claimedRewardAmount, refetch: refetchClaimedRewardAmount } = useQuery({
    queryKey: ['/get-quest-claimed-reward', account, rewardClaimingId],
    queryFn: async () => {
      try {
        if (!rewardClaimingId) throw new Error('Invalid reward id to claim')
        const amount = await contract.read.getClaimedReward([rewardClaimingId, account as Address])
        return amount?.toString() ?? '0'
      } catch (error) {
        console.error('Get quest claimed error: ', error)
        return '0'
      }
    },
    enabled: Boolean(account && rewardClaimingId && isQuestFinished),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>
      {t(
        "Unfortunately, you're not eligible to receive the reward. This could be due to either not completing all the tasks or simply not being included in the winner pool, depending on the distribution type of the quest. For instance, with the Lucky Draw type, you might not have been selected because it's random.",
      )}
    </Text>,
    {
      placement: 'top',
    },
  )

  const [openSuccessClaimedModal] = useModal(
    <SuccessClaimedModal reward={quest.reward} rewardAmount={proofData?.rewardAmount} />,
  )

  const handleClaimReward = useCallback(async () => {
    try {
      if (!rewardClaimingId) throw new Error('Invalid reward id to claim')
      if (proofData && Number(proofData?.rewardAmount) > 0 && !proofData.claimed) {
        const receipt = await fetchWithCatchTxError(() =>
          contract.write.claimReward([rewardClaimingId, BigInt(proofData?.rewardAmount ?? '0'), proofData?.proofs], {
            account,
            chainId,
          } as any),
        )

        if (receipt?.status) {
          await Promise.all([refreshProofData(), refetchClaimedRewardAmount()])

          openSuccessClaimedModal()
          toastSuccess(
            t('Success!'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('You have successfully claimed your rewards.')}
            </ToastDescriptionWithTx>,
          )
        }
      }
    } catch (error) {
      console.error('[ERROR] Submit Claim Quest Reward: ', error)
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    }
  }, [
    proofData,
    contract,
    rewardClaimingId,
    account,
    chainId,
    toastSuccess,
    t,
    toastError,
    refreshProofData,
    openSuccessClaimedModal,
    refetchClaimedRewardAmount,
    fetchWithCatchTxError,
  ])

  const handleSwitchNetwork = async (): Promise<void> => {
    if (quest?.reward?.currency?.network) {
      await switchNetworkAsync(quest?.reward?.currency?.network as ChainId)
    }
  }

  return (
    <>
      <Box>
        {isQuestFinished && !isTasksCompleted && (
          <Box ref={targetRef}>
            <StyledButton $outline variant="secondary" disabled endIcon={<InfoIcon color="textDisabled" />}>
              {t('Unavailable')}
            </StyledButton>
            {tooltipVisible && tooltip}
          </Box>
        )}

        {isQuestFinished && isTasksCompleted && proofData?.rewardAmount === 'null' && (
          <StyledButton $outline variant="secondary" disabled>
            {t('Finished')}
          </StyledButton>
        )}

        {((!isQuestFinished && !isTasksCompleted) || (!isQuestFinished && isTasksCompleted)) && (
          <StyledButton disabled>{t('Claim the reward')}</StyledButton>
        )}

        {isQuestFinished &&
          isTasksCompleted &&
          ableToClaimReward &&
          proofData !== null &&
          chainId === quest?.reward?.currency?.network && (
            <StyledButton
              disabled={!ableToClaimReward || isPending || Number(claimedRewardAmount) > 0}
              onClick={handleClaimReward}
            >
              {t('Claim the reward')}
            </StyledButton>
          )}

        {isQuestFinished &&
          isTasksCompleted &&
          ableToClaimReward &&
          proofData !== null &&
          chainId !== quest?.reward?.currency?.network && (
            <StyledButton onClick={handleSwitchNetwork}>{t('Switch Network')}</StyledButton>
          )}

        {isQuestFinished &&
          isTasksCompleted &&
          !ableToClaimReward &&
          proofData !== null &&
          Number(proofData?.rewardAmount) > 0 && <StyledButton disabled>{t('Claimed')}</StyledButton>}
      </Box>
      <MessageInfo
        proofData={proofData}
        ableToClaimReward={ableToClaimReward}
        isTasksCompleted={isTasksCompleted}
        isQuestFinished={isQuestFinished}
      />
    </>
  )
}
