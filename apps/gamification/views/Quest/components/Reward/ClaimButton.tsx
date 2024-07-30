import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, InfoIcon, Text, useModal, useToast, useTooltip } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { useQuestRewardContract } from 'hooks/useContract'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useCallback, useMemo } from 'react'
import { styled } from 'styled-components'
import { Address, encodePacked, getAddress, keccak256, toHex } from 'viem'
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
      id && quest.ownerAddress
        ? keccak256(encodePacked(['bytes32', 'address'], [toHex(id), getAddress(quest.ownerAddress) as Address]))
        : undefined,
    [quest.ownerAddress, id],
  )

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
      if (proofData && proofData?.proofs?.length > 0) {
        const receipt = await fetchWithCatchTxError(() =>
          contract.write.claimReward([rewardClaimingId, BigInt(proofData?.rewardAmount ?? '0'), proofData?.proofs], {
            account,
            chainId,
          } as any),
        )

        if (receipt?.status) {
          await refreshProofData()

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
    fetchWithCatchTxError,
  ])

  const handleSwitchNetwork = async (): Promise<void> => {
    if (quest?.reward?.currency?.network) {
      await switchNetworkAsync(quest?.reward?.currency?.network as ChainId)
    }
  }

  return (
    <>
      {chainId !== quest?.reward?.currency?.network ? (
        <Button width="100%" onClick={handleSwitchNetwork}>
          {t('Switch Network')}
        </Button>
      ) : (
        <>
          <Box>
            {isQuestFinished && (!isTasksCompleted || (isTasksCompleted && !ableToClaimReward)) ? (
              <Box ref={targetRef}>
                <StyledButton $outline variant="secondary" disabled endIcon={<InfoIcon color="textDisabled" />}>
                  {t('Unavailable')}
                </StyledButton>
                {tooltipVisible && tooltip}
              </Box>
            ) : (
              <StyledButton disabled={!ableToClaimReward || isPending} onClick={handleClaimReward}>
                {t('Claim the reward')}
              </StyledButton>
            )}
          </Box>
          <MessageInfo
            ableToClaimReward={ableToClaimReward}
            isTasksCompleted={isTasksCompleted}
            isQuestFinished={isQuestFinished}
          />
        </>
      )}
    </>
  )
}
