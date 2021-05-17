import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Text, Flex, Image, Button, Slider, BalanceInput, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { BASE_EXCHANGE_URL } from 'config'
import { useAppDispatch } from 'state'
import { BIG_TEN } from 'utils/bigNumber'
import { useCakeVault } from 'state/hooks'
import { useCakeVaultContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useWithdrawalFeeTimer from 'hooks/cakeVault/useWithdrawalFeeTimer'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import { fetchCakeVaultUserData } from 'state/pools'
import { Pool } from 'state/types'
import { convertCakeToShares } from '../../helpers'
import FeeSummary from './FeeSummary'

interface VaultStakeModalProps {
  pool: Pool
  stakingMax: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const VaultStakeModal: React.FC<VaultStakeModalProps> = ({
  pool,
  stakingMax,
  stakingTokenPrice,
  isRemovingStake = false,
  onDismiss,
}) => {
  const dispatch = useAppDispatch()
  const { stakingToken } = pool
  const { account } = useWeb3React()
  const cakeVaultContract = useCakeVaultContract()
  const {
    userData: { lastDepositedTime, userShares },
    pricePerFullShare,
  } = useCakeVault()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [percent, setPercent] = useState(0)
  const { hasUnstakingFee } = useWithdrawalFeeTimer(parseInt(lastDepositedTime))
  const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = new BigNumber(input).multipliedBy(BIG_TEN.pow(stakingToken.decimals))
      const percentage = Math.floor(convertedInput.dividedBy(stakingMax).multipliedBy(100).toNumber())
      setPercent(percentage > 100 ? 100 : percentage)
    } else {
      setPercent(0)
    }
    setStakeAmount(input)
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = stakingMax.dividedBy(100).multipliedBy(sliderPercent)
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals)
      setStakeAmount(amountToStake)
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }

  const handleWithdrawal = async (convertedStakeAmount: BigNumber) => {
    setPendingTx(true)
    const shareStakeToWithdraw = convertCakeToShares(convertedStakeAmount, pricePerFullShare)
    // trigger withdrawAll function if the withdrawal will leave 0.000001 CAKE or less
    const triggerWithdrawAllThreshold = new BigNumber(1000000000000)
    const sharesRemaining = userShares.minus(shareStakeToWithdraw.sharesAsBigNumber)
    const isWithdrawingAll = sharesRemaining.lte(triggerWithdrawAllThreshold)

    if (isWithdrawingAll) {
      cakeVaultContract.methods
        .withdrawAll()
        .send({ from: account })
        .on('sending', () => {
          setPendingTx(true)
        })
        .on('receipt', () => {
          toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
          setPendingTx(false)
          onDismiss()
          dispatch(fetchCakeVaultUserData({ account }))
        })
        .on('error', (error) => {
          console.error(error)
          // Remove message from toast before prod
          toastError(t('Error'), t(`${error.message} - Please try again.`))
          setPendingTx(false)
        })
    } else {
      cakeVaultContract.methods
        .withdraw(shareStakeToWithdraw.sharesAsBigNumber.toString())
        // .toString() being called to fix a BigNumber error in prod
        // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
        .send({ from: account })
        .on('sending', () => {
          setPendingTx(true)
        })
        .on('receipt', () => {
          toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
          setPendingTx(false)
          onDismiss()
          dispatch(fetchCakeVaultUserData({ account }))
        })
        .on('error', (error) => {
          console.error(error)
          // Remove message from toast before prod
          toastError(t('Error'), t(`${error.message} - Please try again.`))
          setPendingTx(false)
        })
    }
  }

  const handleDeposit = async (convertedStakeAmount: BigNumber) => {
    cakeVaultContract.methods
      .deposit(convertedStakeAmount.toString())
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      .send({ from: account })
      .on('sending', () => {
        setPendingTx(true)
      })
      .on('receipt', () => {
        toastSuccess(t('Staked!'), t('Your funds have been staked in the pool'))
        setPendingTx(false)
        onDismiss()
        dispatch(fetchCakeVaultUserData({ account }))
      })
      .on('error', (error) => {
        console.error(error)
        // Remove message from toast before prod
        toastError(t('Error'), t(`${error.message} - Please try again.`))
        setPendingTx(false)
      })
  }

  const handleConfirmClick = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)
    setPendingTx(true)
    // unstaking
    if (isRemovingStake) {
      handleWithdrawal(convertedStakeAmount)
      // staking
    } else {
      handleDeposit(convertedStakeAmount)
    }
  }

  return (
    <Modal
      title={isRemovingStake ? t('Unstake') : t('Stake in Pool')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? t('Unstake') : t('Stake')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${stakingToken.symbol}.png`} width={24} height={24} alt={stakingToken.symbol} />
          <Text ml="4px" bold>
            {stakingToken.symbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={`~${usdValueStaked || 0} USD`}
      />
      <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        Balance: {getFullDisplayBalance(stakingMax, stakingToken.decimals)}
      </Text>
      <Slider
        min={0}
        max={100}
        value={percent}
        onValueChanged={handleChangePercent}
        name="stake"
        valueLabel={`${percent}%`}
        step={1}
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(25)}>
          25%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(50)}>
          50%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(75)}>
          75%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(100)}>
          MAX
        </StyledButton>
      </Flex>
      {isRemovingStake && hasUnstakingFee && (
        <FeeSummary stakingTokenSymbol={stakingToken.symbol} stakeAmount={stakeAmount} />
      )}
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
      {!isRemovingStake && (
        <Button mt="8px" as="a" external href={BASE_EXCHANGE_URL} variant="secondary">
          {t('Get')} {stakingToken.symbol}
        </Button>
      )}
    </Modal>
  )
}

export default VaultStakeModal
