import { useState } from 'react'
import { Modal, Button, AutoRenewIcon, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { BIG_ZERO } from 'utils/bigNumber'

import { usePriceCakeBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useVaultPoolContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { getDecimalAmount } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { fetchCakeVaultUserData } from 'state/pools'
import { DeserializedPool, VaultKey } from 'state/types'
import { getApy } from 'utils/compoundApyHelpers'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { ToastDescriptionWithTx } from 'components/Toast'
import { vaultPoolConfig } from 'config/constants/pools'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { convertSharesToCake } from '../../../helpers'
import Overview from './Overview'
import LockDurationField from './LockDurationField'
import BalanceField from './BalanceField'

interface LockedStakeModalProps {
  pool: DeserializedPool
  performanceFee?: number
  onDismiss?: () => void
}

const LockedStakeModal: React.FC<LockedStakeModalProps> = ({ pool, performanceFee, onDismiss }) => {
  const dispatch = useAppDispatch()

  const { stakingToken, earningToken, rawApr, stakingTokenPrice, earningTokenPrice, userData } = pool
  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const {
    userData: { userShares },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess } = useToast()
  const [stakeAmount, setStakeAmount] = useState('0')
  const [duration, setDuration] = useState(0)
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)
  const cakePriceBusd = usePriceCakeBusd()

  const callOptions = {
    gasLimit: vaultPoolConfig[pool.vaultKey].gasLimit,
  }

  const stakingMax = userData?.stakingTokenBalance ? new BigNumber(userData?.stakingTokenBalance) : BIG_ZERO

  const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare)

  const apy = (getApy(rawApr, 1, duration * 7, performanceFee) * 100).toFixed(2)

  const getTokenLink = stakingToken.address ? `/swap?outputCurrency=${stakingToken.address}` : '/swap'

  const handleDeposit = async (convertedStakeAmount: BigNumber, lockDuration = 0) => {
    const receipt = await fetchWithCatchTxError(() => {
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      const methodArgs =
        pool.vaultKey === VaultKey.IfoPool
          ? [convertedStakeAmount.toString()]
          : [convertedStakeAmount.toString(), lockDuration.toString()]
      return callWithGasPrice(vaultPoolContract, 'deposit', methodArgs, callOptions)
    })

    if (receipt?.status) {
      toastSuccess(
        t('Staked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the pool')}
        </ToastDescriptionWithTx>,
      )
      onDismiss?.()
      dispatch(fetchCakeVaultUserData({ account }))
    }
  }

  const handleConfirmClick = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)

    handleDeposit(convertedStakeAmount)
  }

  if (showRoiCalculator) {
    return (
      <RoiCalculatorModal
        earningTokenPrice={earningTokenPrice}
        stakingTokenPrice={stakingTokenPrice}
        apr={rawApr}
        linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
        linkHref={getTokenLink}
        stakingTokenBalance={cakeAsBigNumber.plus(stakingMax)}
        stakingTokenSymbol={stakingToken.symbol}
        earningTokenSymbol={earningToken.symbol}
        onBack={() => setShowRoiCalculator(false)}
        initialValue={stakeAmount}
        performanceFee={performanceFee}
      />
    )
  }

  return (
    <Modal title="Lock CAKE" onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Box mb="16px">
        <BalanceField
          stakingAddress={stakingToken.address}
          stakingSymbol={stakingToken.symbol}
          stakingDecimals={stakingToken.decimals}
          stakeAmount={stakeAmount}
          cakePriceBusd={cakePriceBusd}
          stakingMax={stakingMax}
          setStakeAmount={setStakeAmount}
        />
      </Box>
      <Box mb="16px">
        <LockDurationField setDuration={setDuration} duration={duration} />
      </Box>
      <Overview
        openCalculator={() => setShowRoiCalculator(true)}
        apy={apy}
        cakePriceBusd={cakePriceBusd}
        stakeAmount={stakeAmount}
      />
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
    </Modal>
  )
}

export default LockedStakeModal
