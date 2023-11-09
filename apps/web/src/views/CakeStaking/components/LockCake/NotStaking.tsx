import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, ColumnCenter, Grid, Heading, useModalV2 } from '@pancakeswap/uikit'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { ApprovalState } from 'hooks/useApproveCallback'
import { useVeCakeContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getVeCakeAmount } from 'utils/getVeCakeAmount'
import { isUserRejected } from 'utils/sentry'
import { Hash, stringify } from 'viem'
import { useLockApproveCallback } from 'views/CakeStaking/hooks/useLockAllowance'
import { ApproveAndLockStatus } from 'views/CakeStaking/types'
import { useAccount, useWalletClient } from 'wagmi'
import { ApproveAndLockModal } from '../ApproveAndLockModal'
import { NewStakingDataSet } from '../DataSet'
import { LockCakeFormV2 } from '../LockCakeForm'
import { LockWeeksFormV2 } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const NotStaking = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: walletClient } = useWalletClient()
  const veCakeContract = useVeCakeContract()
  const modal = useModalV2()

  // @fixme: @ChefJerry
  const [cakeValue, setCakeValue] = useState('0')
  const [lockWeeks, setLockWeeks] = useState('52')
  const [txHash, setTxHash] = useState<Hash | undefined>()
  const [status, setStatus] = useState(ApproveAndLockStatus.IDLE)
  const [approved, setApproved] = useState(false)

  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const { approvalState, approveCallback, currentAllowance } = useLockApproveCallback(cakeValue)

  const disabled = useMemo(() => Boolean(!Number(cakeValue) || !Number(lockWeeks)), [cakeValue, lockWeeks])

  const handleCancel = useCallback(() => {
    setStatus(ApproveAndLockStatus.IDLE)
    modal.onDismiss()
  }, [modal, setStatus])

  const lockCake = useCallback(async () => {
    const { request } = await veCakeContract.simulate.createLock(
      [
        BigInt(getDecimalAmount(new BN(cakeValue), 18).toString()),
        BigInt(dayjs().add(Number(lockWeeks), 'week').unix()),
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
  }, [veCakeContract, cakeValue, lockWeeks, account, setStatus, setTxHash, waitForTransaction, walletClient])

  const handleModalOpen = useCallback(async () => {
    setTxHash(undefined)
    modal.onOpen()
    try {
      if (approvalState === ApprovalState.NOT_APPROVED) {
        setStatus(ApproveAndLockStatus.APPROVING_TOKEN)
        const { hash } = await approveCallback()
        if (hash) {
          await waitForTransaction({ hash })
        }
        setStatus(ApproveAndLockStatus.LOCK_CAKE)
        return
      }
      if (approvalState === ApprovalState.APPROVED) {
        await lockCake()
        return
      }
    } catch (error) {
      console.error(error)
      if (isUserRejected(error)) {
        handleCancel()
      }
    }
  }, [approvalState, modal, approveCallback, handleCancel, lockCake, setStatus, waitForTransaction])

  useEffect(() => {
    console.debug('currentAllowance', currentAllowance?.toSignificant())
    if (!modal.isOpen) {
      const cakeAmountBN = getDecimalAmount(new BN(cakeValue), 18).toString()
      if (
        Number(cakeValue) &&
        (currentAllowance?.greaterThan(cakeAmountBN) || currentAllowance?.equalTo(cakeAmountBN))
      ) {
        setApproved(true)
      } else {
        setApproved(false)
      }
    }
  }, [cakeValue, currentAllowance, setApproved, modal.isOpen])

  useEffect(() => {
    if (modal.isOpen && !approved) {
      if (status === ApproveAndLockStatus.LOCK_CAKE) {
        lockCake()
      }
    }
  }, [modal.isOpen, approved, status, lockCake])

  return (
    <>
      <ApproveAndLockModal
        {...modal}
        approved={approved}
        status={status}
        lockCakeAmount={cakeValue}
        lockWeeks={lockWeeks}
        hash={txHash}
      />
      <Box maxWidth={['100%', '72%']} mx="auto">
        <StyledCard innerCardProps={{ padding: '24px' }}>
          <Heading scale="md">{t('Lock CAKE to get veCAKE')}</Heading>
          <Grid gridTemplateColumns="1fr 1fr" mt={32} gridColumnGap="24px" padding={12} mb={32}>
            <LockCakeFormV2 fieldOnly value={cakeValue} onChange={setCakeValue} />
            <LockWeeksFormV2 fieldOnly value={lockWeeks} onChange={setLockWeeks} />
          </Grid>
          <NewStakingDataSet
            veCakeAmount={getVeCakeAmount(cakeValue, lockWeeks)}
            cakeAmount={Number(cakeValue)}
            duration={Number(lockWeeks)}
          />
          <pre>{stringify({ approved, approvalState, currentAllowance }, null, 2)}</pre>
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
