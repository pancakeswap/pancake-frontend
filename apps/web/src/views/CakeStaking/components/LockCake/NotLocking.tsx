import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, ColumnCenter, Grid, Heading } from '@pancakeswap/uikit'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { ApprovalState } from 'hooks/useApproveCallback'
import { useVeCakeContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import {
  ApproveAndLockStatus,
  approveAndLockStatusAtom,
  cakeLockAmountAtom,
  cakeLockTxHashAtom,
  cakeLockWeeksAtom,
} from 'state/vecake/atoms'
import { useLockCakeData } from 'state/vecake/hooks'
import { getVeCakeAmount } from 'utils/getVeCakeAmount'
import { isUserRejected } from 'utils/sentry'
import { stringify } from 'viem'
import { useLockApproveCallback } from 'views/CakeStaking/hooks/useLockAllowance'
import { useAccount, useWalletClient } from 'wagmi'
import { NewStakingDataSet } from '../DataSet'
import { LockCakeFormV2 } from '../LockCakeForm'
import { LockWeeksFormV2 } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const NotLocking = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: walletClient } = useWalletClient()
  const veCakeContract = useVeCakeContract()
  const { cakeLockApproved, cakeLockAmount, cakeLockWeeks } = useLockCakeData()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const setCakeLockAmount = useSetAtom(cakeLockAmountAtom)
  const setCakeLockWeeks = useSetAtom(cakeLockWeeksAtom)

  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const { approvalState, approveCallback, currentAllowance } = useLockApproveCallback(cakeLockAmount)
  const resetData = useLockCakeDataResetCallback()

  const disabled = useMemo(
    () => Boolean(!Number(cakeLockAmount) || !Number(cakeLockWeeks)),
    [cakeLockAmount, cakeLockWeeks],
  )

  const handleCancel = useCallback(() => {
    setStatus(ApproveAndLockStatus.IDLE)
  }, [setStatus])

  const lockCake = useCallback(async () => {
    const { request } = await veCakeContract.simulate.createLock(
      [
        BigInt(getDecimalAmount(new BN(cakeLockAmount), 18).toString()),
        BigInt(dayjs().add(Number(cakeLockWeeks), 'week').unix()),
      ],
      {
        account: account!,
        chain: veCakeContract.chain,
      },
    )

    setStatus(ApproveAndLockStatus.LOCK_CAKE)

    const hash = await walletClient?.writeContract(request)
    setTxHash(hash)
    setStatus(ApproveAndLockStatus.LOCK_CAKE_PENDING)
    if (hash) {
      await waitForTransaction({ hash })
    }
    setStatus(ApproveAndLockStatus.CONFIRMED)
  }, [veCakeContract, cakeLockAmount, cakeLockWeeks, account, setStatus, setTxHash, waitForTransaction, walletClient])

  const handleModalOpen = useCallback(async () => {
    setTxHash(undefined)
    try {
      if (approvalState === ApprovalState.NOT_APPROVED) {
        setStatus(ApproveAndLockStatus.APPROVING_TOKEN)
        const { hash } = await approveCallback()
        if (hash) {
          await waitForTransaction({ hash })
        }
        setStatus(ApproveAndLockStatus.LOCK_CAKE)
        await lockCake()
        resetData()
        return
      }
      if (approvalState === ApprovalState.APPROVED) {
        await lockCake()
        resetData()
        return
      }
    } catch (error) {
      console.error(error)
      if (isUserRejected(error)) {
        handleCancel()
      }
    }
  }, [approvalState, approveCallback, handleCancel, lockCake, resetData, setStatus, setTxHash, waitForTransaction])

  return (
    <>
      <Box maxWidth={['100%', '72%']} mx="auto">
        <StyledCard innerCardProps={{ padding: '24px' }}>
          <Heading scale="md">{t('Lock CAKE to get veCAKE')}</Heading>
          <Grid gridTemplateColumns="1fr 1fr" mt={32} gridColumnGap="24px" padding={12} mb={32}>
            <LockCakeFormV2 fieldOnly value={cakeLockAmount} onChange={setCakeLockAmount} />
            <LockWeeksFormV2 fieldOnly value={cakeLockWeeks} onChange={setCakeLockWeeks} />
          </Grid>
          <NewStakingDataSet
            veCakeAmount={getVeCakeAmount(cakeLockAmount, cakeLockWeeks)}
            cakeAmount={Number(cakeLockAmount)}
            duration={Number(cakeLockWeeks)}
          />
          <pre>{stringify({ cakeLockApproved, approvalState, currentAllowance }, null, 2)}</pre>
          <ColumnCenter>
            <Button disabled={disabled} width="50%" onClick={handleModalOpen}>
              {t('Lock CAKE')}
            </Button>
          </ColumnCenter>
        </StyledCard>
      </Box>
    </>
  )
}
