import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Modal,
  Text,
  Flex,
  Image,
  Button,
  Slider,
  BalanceInput,
  AutoRenewIcon,
  CalculateIcon,
  IconButton,
  Skeleton,
  Message,
  MessageText,
  Box,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'

import { BIG_TEN } from 'utils/bigNumber'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useIfoPoolCreditBlock, useVaultPoolByKey } from 'state/pools/hooks'
import { useVaultPoolContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useWithdrawalFeeTimer from 'views/Pools/hooks/useWithdrawalFeeTimer'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { fetchCakeVaultUserData } from 'state/pools'
import { DeserializedPool, VaultKey } from 'state/types'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { ToastDescriptionWithTx } from 'components/Toast'
import { vaultPoolConfig } from 'config/constants/pools'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { convertCakeToShares, convertSharesToCake } from '../../helpers'
import FeeSummary from './FeeSummary'

interface VaultStakeModalProps {
  pool: DeserializedPool
  stakingMax: BigNumber
  performanceFee?: number
  isRemovingStake?: boolean
  onDismiss?: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`

const AnnualRoiDisplay = styled(Text)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`

const CreditEndNotice = () => {
  const { hasEndBlockOver } = useIfoPoolCreditBlock()
  const { t } = useTranslation()
  if (!hasEndBlockOver) return null
  return (
    <Box maxWidth="350px">
      <Message variant="warning" mb="16px">
        <MessageText>
          {t('The latest credit calculation period has ended. Calculation will resume upon the next period starts.')}
        </MessageText>
      </Message>
    </Box>
  )
}

const VaultStakeModal: React.FC<VaultStakeModalProps> = ({
  pool,
  stakingMax,
  performanceFee,
  isRemovingStake = false,
  onDismiss,
}) => {
  const dispatch = useAppDispatch()
  const { stakingToken, earningToken, apr, rawApr, stakingTokenPrice, earningTokenPrice, vaultKey } = pool
  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract(pool.vaultKey)
  const { callWithGasPrice } = useCallWithGasPrice()
  const {
    userData: { lastDepositedTime, userShares },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess } = useToast()
  const [stakeAmount, setStakeAmount] = useState('')
  const [percent, setPercent] = useState(0)
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)
  const { hasUnstakingFee } = useWithdrawalFeeTimer(parseInt(lastDepositedTime, 10), userShares)
  const cakePriceBusd = usePriceCakeBusd()
  const usdValueStaked = new BigNumber(stakeAmount).times(cakePriceBusd)
  const formattedUsdValueStaked = cakePriceBusd.gt(0) && stakeAmount ? formatNumber(usdValueStaked.toNumber()) : ''

  const callOptions = {
    gasLimit: vaultPoolConfig[pool.vaultKey].gasLimit,
  }

  const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare)

  const interestBreakdown = getInterestBreakdown({
    principalInUSD: !usdValueStaked.isNaN() ? usdValueStaked.toNumber() : 0,
    apr: vaultKey ? rawApr : apr,
    earningTokenPrice,
    performanceFee,
  })
  const annualRoi = interestBreakdown[3] * pool.earningTokenPrice
  const formattedAnnualRoi = formatNumber(annualRoi, annualRoi > 10000 ? 0 : 2, annualRoi > 10000 ? 0 : 2)

  const getTokenLink = stakingToken.address ? `/swap?outputCurrency=${stakingToken.address}` : '/swap'

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
    const shareStakeToWithdraw = convertCakeToShares(convertedStakeAmount, pricePerFullShare)
    // trigger withdrawAll function if the withdrawal will leave 0.000001 CAKE or less
    const triggerWithdrawAllThreshold = new BigNumber(1000000000000)
    const sharesRemaining = userShares.minus(shareStakeToWithdraw.sharesAsBigNumber)
    const isWithdrawingAll = sharesRemaining.lte(triggerWithdrawAllThreshold)

    const receipt = await fetchWithCatchTxError(() => {
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      return isWithdrawingAll
        ? callWithGasPrice(vaultPoolContract, 'withdrawAll', undefined, callOptions)
        : callWithGasPrice(
            vaultPoolContract,
            'withdraw',
            [shareStakeToWithdraw.sharesAsBigNumber.toString()],
            callOptions,
          )
    })

    if (receipt?.status) {
      toastSuccess(
        t('Unstaked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      onDismiss?.()
      dispatch(fetchCakeVaultUserData({ account }))
    }
  }

  const handleDeposit = async (convertedStakeAmount: BigNumber) => {
    const receipt = await fetchWithCatchTxError(() => {
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      return callWithGasPrice(vaultPoolContract, 'deposit', [convertedStakeAmount.toString()], callOptions)
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
    if (isRemovingStake) {
      // unstaking
      handleWithdrawal(convertedStakeAmount)
    } else {
      // staking
      handleDeposit(convertedStakeAmount)
    }
  }

  if (showRoiCalculator) {
    return (
      <RoiCalculatorModal
        earningTokenPrice={earningTokenPrice}
        stakingTokenPrice={stakingTokenPrice}
        apr={vaultKey ? rawApr : apr}
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
    <Modal
      title={isRemovingStake ? t('Unstake') : t('Stake in Pool')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {pool.vaultKey === VaultKey.IfoPool && <CreditEndNotice />}
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? t('Unstake') : t('Stake')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${stakingToken.address}.png`} width={24} height={24} alt={stakingToken.symbol} />
          <Text ml="4px" bold>
            {stakingToken.symbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={cakePriceBusd.gt(0) && `~${formattedUsdValueStaked || 0} USD`}
        decimals={stakingToken.decimals}
      />
      <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        {t('Balance: %balance%', { balance: getFullDisplayBalance(stakingMax, stakingToken.decimals) })}
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
          {t('Max')}
        </StyledButton>
      </Flex>
      {isRemovingStake && hasUnstakingFee && (
        <FeeSummary vaultKey={vaultKey} stakingTokenSymbol={stakingToken.symbol} stakeAmount={stakeAmount} />
      )}
      {!isRemovingStake && (
        <Flex mt="24px" alignItems="center" justifyContent="space-between">
          <Text mr="8px" color="textSubtle">
            {t('Annual ROI at current rates')}:
          </Text>
          {Number.isFinite(annualRoi) ? (
            <AnnualRoiContainer
              alignItems="center"
              onClick={() => {
                setShowRoiCalculator(true)
              }}
            >
              <AnnualRoiDisplay>${formattedAnnualRoi}</AnnualRoiDisplay>
              <IconButton variant="text" scale="sm">
                <CalculateIcon color="textSubtle" width="18px" />
              </IconButton>
            </AnnualRoiContainer>
          ) : (
            <Skeleton width={60} />
          )}
        </Flex>
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
        <Button mt="8px" as="a" external href={getTokenLink} variant="secondary">
          {t('Get %symbol%', { symbol: stakingToken.symbol })}
        </Button>
      )}
    </Modal>
  )
}

export default VaultStakeModal
