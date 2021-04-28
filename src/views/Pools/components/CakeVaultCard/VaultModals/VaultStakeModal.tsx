import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Text, Flex, Image, Button, Slider, BalanceInput, AutoRenewIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { BASE_EXCHANGE_URL } from 'config'
import { useCakeVaultContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import usePerformanceFeeTimer from 'hooks/cakeVault/usePerformanceFeeTimer'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import { Pool } from 'state/types'
import { VaultUser } from 'views/Pools/types'
import { convertCakeToShares } from '../../../helpers'
import FeeSummary from './FeeSummary'

interface VaultStakeModalProps {
  pool: Pool
  stakingMax: BigNumber
  stakingTokenPrice: number
  account: string
  userInfo: VaultUser
  isRemovingStake?: boolean
  pricePerFullShare?: BigNumber
  performanceFee?: number
  setLastUpdated: () => void
  onDismiss?: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const VaultStakeModal: React.FC<VaultStakeModalProps> = ({
  pool,
  stakingMax,
  stakingTokenPrice,
  pricePerFullShare,
  account,
  userInfo,
  isRemovingStake = false,
  performanceFee = 200,
  onDismiss,
  setLastUpdated,
}) => {
  const { stakingToken } = pool
  const cakeVaultContract = useCakeVaultContract()
  const TranslateString = useI18n()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [percent, setPercent] = useState(0)
  const { hasPerformanceFee } = usePerformanceFeeTimer(parseInt(userInfo.lastDepositedTime))
  const usdValueStaked = stakeAmount && formatNumber(parseFloat(stakeAmount) * stakingTokenPrice)

  const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value ? event.target.value : '0'
    console.log('input value - ', inputValue)
    const convertedInput = new BigNumber(inputValue).multipliedBy(new BigNumber(10).pow(stakingToken.decimals))
    const percentage = Math.floor(convertedInput.dividedBy(stakingMax).multipliedBy(100).toNumber())
    setStakeAmount(inputValue)
    setPercent(percentage > 100 ? 100 : percentage)
  }

  const handleChangePercent = (sliderPercent: number) => {
    const percentageOfStakingMax = stakingMax.dividedBy(100).multipliedBy(sliderPercent)
    const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals)
    setStakeAmount(amountToStake)
    setPercent(sliderPercent)
  }

  const convertStakeAmount = () => {
    console.log('stakeAmount -', stakeAmount)
    const stakeAmountAsBigNumber = new BigNumber(stakeAmount)
    return getDecimalAmount(stakeAmountAsBigNumber, stakingToken.decimals)
  }

  const handleConfirmClick = async () => {
    const convertedStakeAmount = convertStakeAmount()
    console.log('converted stake amount - ', convertedStakeAmount)

    setPendingTx(true)
    if (isRemovingStake) {
      // unstaking
      const { sharesAsBigNumber } = convertCakeToShares(convertedStakeAmount, pricePerFullShare)
      cakeVaultContract.methods
        // .toString() being called to debug a BigNumber error in prod
        // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
        .withdraw(sharesAsBigNumber.toString())
        .send({ from: account })
        .on('sending', () => {
          setPendingTx(true)
        })
        .on('receipt', async () => {
          toastSuccess(
            TranslateString(999, 'Unstaked!'),
            TranslateString(999, 'Your earnings have also been harvested to your wallet'),
          )
          setPendingTx(false)
          onDismiss()
          setLastUpdated()
        })
        .on('error', (error) => {
          console.error(error)
          // Remove message from toast before prod
          toastError(TranslateString(999, 'Error'), TranslateString(999, `${error.message} - Please try again.`))
          setPendingTx(false)
        })
    } else {
      console.log('toString ', convertedStakeAmount.toString())
      cakeVaultContract.methods
        // .toString() being called to debug a BigNumber error in prod
        // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
        .deposit(convertedStakeAmount.toString())
        .send({ from: account })
        .on('sending', () => {
          setPendingTx(true)
        })
        .on('receipt', async () => {
          toastSuccess(TranslateString(999, 'Staked!'), TranslateString(999, 'Your funds have been staked in the pool'))
          setPendingTx(false)
          onDismiss()
          setLastUpdated()
        })
        .on('error', (error) => {
          console.error(error)
          // Remove message from toast before prod
          toastError(TranslateString(999, 'Error'), TranslateString(999, `${error.message} - Please try again.`))
          setPendingTx(false)
        })
    }
  }

  return (
    <Modal
      title={isRemovingStake ? TranslateString(588, 'Unstake') : TranslateString(999, 'Stake in Pool')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? TranslateString(588, 'Unstake') : TranslateString(316, 'Stake')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${stakingToken.symbol}.png`} width={24} height={24} alt={stakingToken.symbol} />
          <Text ml="4px" bold>
            {stakingToken.symbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onChange={handleStakeInputChange}
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
      {isRemovingStake && hasPerformanceFee && (
        <FeeSummary
          stakingTokenSymbol={stakingToken.symbol}
          lastDepositedTime={userInfo.lastDepositedTime}
          performanceFee={performanceFee}
          stakeAmount={stakeAmount}
        />
      )}
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0}
        mt="24px"
      >
        {pendingTx ? TranslateString(802, 'Confirming') : TranslateString(464, 'Confirm')}
      </Button>
      {!isRemovingStake && (
        <Button mt="8px" as="a" external href={BASE_EXCHANGE_URL} variant="secondary">
          {TranslateString(999, 'Get')} {stakingToken.symbol}
        </Button>
      )}
    </Modal>
  )
}

export default VaultStakeModal
