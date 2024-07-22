import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, InfoIcon, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
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

  const hasProof = false // Should call API

  const ableToClaimReward = useMemo(
    () => isTasksCompleted && hasProof && new BigNumber(claimedRewardAmount ?? 0).eq(BIG_ZERO),
    [claimedRewardAmount, hasProof, isTasksCompleted],
  )

  const handleClaimReward = useCallback(async () => {
    try {
      const proof: Address[] = ['0x']
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
    } catch (error) {
      console.error('[ERROR] Submit Claim Quest Reward: ', error)
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    }
  }, [account, chainId, claimedRewardAmount, contract.write, fetchWithCatchTxError, id, t, toastError, toastSuccess])

  return (
    <>
      <Box>
        <StyledButton
          isLoading={isPending}
          disabled={!ableToClaimReward || isPending}
          endIcon={!ableToClaimReward ? <InfoIcon color="textDisabled" /> : undefined}
          onClick={handleClaimReward}
        >
          {ableToClaimReward ? t('Claim the reward') : t('Unavailable')}
        </StyledButton>
      </Box>
      <MessageInfo ableToClaimReward={ableToClaimReward} isQuestFinished={isQuestFinished} />
    </>
  )
}
