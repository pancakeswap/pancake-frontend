import { useMemo } from 'react'
import { Button, useModal, Message, MessageText, Box, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { differenceInSeconds } from 'date-fns'
import { useAppDispatch } from 'state'
import { fetchCakeVaultUserData } from 'state/pools'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useVaultPoolContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { ToastDescriptionWithTx } from 'components/Toast'

import ExtendDurationModal from '../LockedStakeModal/ExtendDurationModal'
import AddAmountModal from '../LockedStakeModal/AddAmountModal'

const AddCakeButton = ({ currentBalance, stakingToken, currentLockedAmount, lockEndTime, lockStartTime }) => {
  const { t } = useTranslation()
  const remainingDuration = differenceInSeconds(new Date(parseInt(lockEndTime) * 1000), new Date())
  const passedDuration = differenceInSeconds(new Date(), new Date(parseInt(lockStartTime) * 1000))

  const [openAddAmountModal] = useModal(
    <AddAmountModal
      passedDuration={passedDuration}
      currentLockedAmount={currentLockedAmount}
      remainingDuration={remainingDuration}
      currentBalance={currentBalance}
      stakingToken={stakingToken}
    />,
  )

  return (
    <Button onClick={() => openAddAmountModal()} width="100%">
      {t('Add Cake')}
    </Button>
  )
}

const ExtendButton = ({ stakingToken, currentLockedAmount, lockEndTime, lockStartTime, children }) => {
  const currentDuration = lockEndTime - lockStartTime

  const [openExtendDurationModal] = useModal(
    <ExtendDurationModal
      stakingToken={stakingToken}
      lockStartTime={lockStartTime}
      currentLockedAmount={currentLockedAmount}
      currentDuration={currentDuration}
    />,
  )

  return (
    <Button mx="4px" onClick={() => openExtendDurationModal()} width="100%">
      {children}
    </Button>
  )
}

const ConverToFlexibleButton = () => {
  // TODO: Remove duplication
  const dispatch = useAppDispatch()

  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()

  const handleUnlock = async () => {
    // TODO: Update proper gasLimit
    const callOptions = {
      gasLimit: 500000,
    }

    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [account]
      return callWithGasPrice(vaultPoolContract, 'unlock', methodArgs, callOptions)
    })

    if (receipt?.status) {
      toastSuccess(
        t('Staked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the pool')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchCakeVaultUserData({ account }))
    }
  }

  return (
    <Button disabled={pendingTx} mb="8px" mx="4px" width="100%" onClick={() => handleUnlock()}>
      {pendingTx ? t('Converting...') : t('Convert to Flexible')}
    </Button>
  )
}

export const AfterLockedActions = ({
  lockEndTime,
  lockStartTime,
  currentLockedAmount,
  stakingToken,
  position,
  isInline = false,
}) => {
  const { t } = useTranslation()

  const msg = {
    [VaultPosition.None]: null,
    [VaultPosition.LockedEnd]:
      'Lock period has ended. We recommend you unlock your position or adjust it to start a new lock.',
    [VaultPosition.AfterBurning]:
      'The lock period has ended. To avoid more rewards being burned, we recommend you unlock your position or adjust it to start a new lock.',
  }

  const Container = isInline ? Flex : Box

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Container mt="8px">
          <ConverToFlexibleButton />
          <ExtendButton
            lockEndTime={lockEndTime}
            lockStartTime={lockStartTime}
            stakingToken={stakingToken}
            currentLockedAmount={currentLockedAmount}
          >
            {t('Renew')}
          </ExtendButton>
        </Container>
      }
    >
      <MessageText>{msg[position]}</MessageText>
    </Message>
  )
}

const LockedActions = ({ userData, stakingToken, stakingTokenBalance }) => {
  const position = useMemo(() => getVaultPosition(userData), [userData])
  const cakeBalance = getBalanceNumber(userData?.lockedAmount)

  const currentBalance = useMemo(
    () => (stakingTokenBalance ? new BigNumber(stakingTokenBalance) : BIG_ZERO),
    [stakingTokenBalance],
  )

  if (position === VaultPosition.Locked) {
    return (
      <Flex>
        <AddCakeButton
          lockEndTime={userData?.lockEndTime}
          lockStartTime={userData?.lockStartTime}
          currentLockedAmount={cakeBalance}
          stakingToken={stakingToken}
          currentBalance={currentBalance}
        />
        <ExtendButton
          lockEndTime={userData?.lockEndTime}
          lockStartTime={userData?.lockStartTime}
          stakingToken={stakingToken}
          currentLockedAmount={cakeBalance}
        >
          {t('Extend')}
        </ExtendButton>
      </Flex>
    )
  }

  return (
    <AfterLockedActions
      lockEndTime={userData?.lockEndTime}
      lockStartTime={userData?.lockStartTime}
      position={position}
      currentLockedAmount={cakeBalance}
      stakingToken={stakingToken}
    />
  )
}

export default LockedActions
