import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, InfoIcon, Text, useToast, useTooltip } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { useQuestRewardContract } from 'hooks/useContract'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useCallback, useMemo } from 'react'
import { styled } from 'styled-components'
import { Address, encodePacked, getAddress, keccak256, toHex } from 'viem'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { MessageInfo } from 'views/Quest/components/Reward/MessageInfo'

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
}

interface GetMerkleProofResponse {
  userId: Address
  questId: string
  proofs: Address[]
  rewardAmount: string
  claimed: boolean
  claimedError: string
  errorMessage: string
  claimTransactionHash: string
}

export const ClaimButton: React.FC<ClaimButtonProps> = ({ quest, isTasksCompleted, isQuestFinished }) => {
  const { t } = useTranslation()
  const { id, completionStatus } = quest
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

  const { data: claimedRewardAmount } = useQuery({
    queryKey: ['/get-quest-claimed-reward', account, rewardClaimingId],
    queryFn: async () => {
      if (!rewardClaimingId) throw new Error('Invalid reward id to claim')
      const amount = await contract.read.getClaimedReward([rewardClaimingId, account as Address])
      return amount?.toString() ?? '0'
    },
    enabled: Boolean(account && rewardClaimingId && completionStatus === CompletionStatus.FINISHED),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const { data: proofData } = useQuery({
    queryKey: ['/get-user-merkle-proof', account, id],
    queryFn: async () => {
      const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/users/${account}/quests/${id}/merkle-proof`)
      const result: GetMerkleProofResponse = await response.json()
      return result
    },
    enabled: Boolean(account && id && isTasksCompleted),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const hasProof = useMemo(() => Boolean(proofData && proofData?.proofs?.length > 0), [proofData])

  const ableToClaimReward = useMemo(
    () => isTasksCompleted && hasProof && new BigNumber(claimedRewardAmount ?? 0).eq(BIG_ZERO),
    [claimedRewardAmount, hasProof, isTasksCompleted],
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
  }, [proofData, contract, rewardClaimingId, account, chainId, toastSuccess, t, toastError, fetchWithCatchTxError])

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
              <StyledButton disabled={!ableToClaimReward || !isPending} onClick={handleClaimReward}>
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
