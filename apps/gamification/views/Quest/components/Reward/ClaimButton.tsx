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
import { useCallback, useMemo } from 'react'
import { styled } from 'styled-components'
import { Address, toHex } from 'viem'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { MessageInfo } from 'views/Quest/components/Reward/MessageInfo'

const StyledButton = styled(Button)`
  width: 100%;
  margin: 8px 0;
  border-radius: 24px;
`

interface ClaimButtonProps {
  quest: SingleQuestData
  isTasksCompleted: boolean
  isQuestFinished: boolean
}

export const ClaimButton: React.FC<ClaimButtonProps> = ({ quest, isTasksCompleted, isQuestFinished }) => {
  const { t } = useTranslation()
  const { id, completionStatus } = quest
  const { account, chainId } = useActiveWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = useQuestRewardContract(quest.reward?.currency?.network as ChainId)

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
    queryKey: ['/get-quest-claimed-reward', account, id],
    queryFn: async () => {
      const amount = await contract.read.getClaimedReward([toHex(id), account as Address])
      return amount?.toString() ?? '0'
    },
    enabled: Boolean(account && id && completionStatus === CompletionStatus.FINISHED),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const { data: proof } = useQuery({
    queryKey: ['/get-user-merkle-proof', account, id],
    queryFn: async () => {
      const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/users/${account}/quests/${id}/merkle-proof`)
      return response.json() as Promise<Address[]>
    },
    enabled: Boolean(account && id),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const hasProof = useMemo(() => Boolean(proof && proof?.length > 0), [proof])

  const ableToClaimReward = useMemo(
    () => isTasksCompleted && hasProof && new BigNumber(claimedRewardAmount ?? 0).eq(BIG_ZERO),
    [claimedRewardAmount, hasProof, isTasksCompleted],
  )

  const handleClaimReward = useCallback(async () => {
    try {
      if (proof && proof?.length > 0) {
        const receipt = await fetchWithCatchTxError(() =>
          contract.write.claimReward([toHex(id), BigInt(claimedRewardAmount ?? '0'), proof], {
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
  }, [id, proof, account, chainId, claimedRewardAmount, contract, fetchWithCatchTxError, t, toastError, toastSuccess])

  return (
    <>
      <Box ref={targetRef}>
        <StyledButton
          isLoading={isPending}
          disabled={!ableToClaimReward || isPending}
          endIcon={!ableToClaimReward ? <InfoIcon color="textDisabled" /> : undefined}
          onClick={handleClaimReward}
        >
          {ableToClaimReward ? t('Claim the reward') : t('Unavailable')}
        </StyledButton>
        {!ableToClaimReward && tooltipVisible && tooltip}
      </Box>
      <MessageInfo ableToClaimReward={ableToClaimReward} isQuestFinished={isQuestFinished} />
    </>
  )
}
