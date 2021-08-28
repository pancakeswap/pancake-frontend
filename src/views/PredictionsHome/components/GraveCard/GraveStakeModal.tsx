import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Text, Flex, Image, Button, Slider, BalanceInput, AutoRenewIcon } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { BASE_EXCHANGE_URL } from 'config'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import Web3 from 'web3'
import FeeSummary from './FeeSummary'
import { GraveConfig } from '../../../../config/constants/types'
import tokens from '../../../../config/constants/tokens'

interface VaultStakeModalProps {
  grave: GraveConfig
  stakingMax: BigNumber
  stakingTokenPrice: BigNumber
  account: string
  userData: any
  isRemovingStake?: boolean
  pricePerFullShare?: BigNumber
  onDismiss?: () => void
  web3: Web3
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`
const GraveStakeModal: React.FC<VaultStakeModalProps> = ({
  grave,
  stakingMax,
  stakingTokenPrice,
  account,
  userData,
  isRemovingStake = false,
  onDismiss,
  web3
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [percent, setPercent] = useState(0)
  const { withdrawalDate } = userData
  const now = Date.now() / 1000
  const hasUnstakingFee = withdrawalDate > now
  const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())
  const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value || '0'
    const convertedInput = new BigNumber(inputValue).multipliedBy(new BigNumber(10).pow(tokens.zmbe.decimals))
    const percentage = Math.floor(convertedInput.dividedBy(stakingMax).multipliedBy(100).toNumber())
    setStakeAmount(inputValue)
    setPercent(percentage > 100 ? 100 : percentage)
  }

  const handleChangePercent = (sliderPercent: number) => {
    const percentageOfStakingMax = stakingMax.dividedBy(100).multipliedBy(sliderPercent)
    const amountToStake = getFullDisplayBalance(percentageOfStakingMax, tokens.zmbe.decimals, tokens.zmbe.decimals)
    setStakeAmount(amountToStake)
    setPercent(sliderPercent)
  }

  const handleWithdrawal = async (convertedStakeAmount: BigNumber) => {
    setPendingTx(true)
    // const shareStakeToWithdraw = convertCakeToShares(convertedStakeAmount, pricePerFullShare)
    // trigger withdrawAll function if the withdrawal will leave 0.000000000000200000 CAKE or less
    const triggerWithdrawAllThreshold = new BigNumber(200000)
    const sharesRemaining = new BigNumber(userData.zombieStaked).minus(convertedStakeAmount)
    const isWithdrawingAll = sharesRemaining.lte(triggerWithdrawAllThreshold)

    if (isWithdrawingAll) {
      // restorationChefContract.methods
      //   .withdrawAll(grave.gid)
      //   .send({ from: account })
      //   .on('sending', () => {
      //     setPendingTx(true)
      //   })
      //   .on('receipt', () => {
      //     toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
      //     setPendingTx(false)
      //     onDismiss()
      //   })
      //   .on('error', (error) => {
      //     console.error(error)
      //     // Remove message from toast before prod
      //     toastError(t('Error'), t(`${error.message} - Please try again.`))
      //     setPendingTx(false)
      //   })
    } else {
      // restorationChefContract.methods
      //   .withdrawZombie(grave.gid, convertedStakeAmount.toString())
      //   // .toString() being called to fix a BigNumber error in prod
      //   // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      //   .send({ from: account })
      //   .on('sending', () => {
      //     setPendingTx(true)
      //   })
      //   .on('receipt', () => {
      //     toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
      //     setPendingTx(false)
      //     onDismiss()
      //   })
      //   .on('error', (error) => {
      //     console.error(error)
      //     // Remove message from toast before prod
      //     toastError(t('Error'), t(`${error.message} - Please try again.`))
      //     setPendingTx(false)
      //   })
    }
  }

  const handleDeposit = async (convertedStakeAmount: BigNumber) => {
    console.log(convertedStakeAmount.toString())
    // restorationChefContract.methods
    //   .stakeZombie(grave.gid, convertedStakeAmount.toString())
    //   // .toString() being called to fix a BigNumber error in prod
    //   // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
    //   .send({ from: account })
    //   .on('sending', () => {
    //     setPendingTx(true)
    //   })
    //   .on('receipt', () => {
    //     toastSuccess(t('Staked!'), t('Your funds have been staked in the pool'))
    //     setPendingTx(false)
    //     onDismiss()
    //   })
    //   .on('error', (error) => {
    //     console.error(error)
    //     // Remove message from toast before prod
    //     toastError(t('Error'), t(`${error.message} - Please try again.`))
    //     setPendingTx(false)
    //   })
  }

  const handleConfirmClick = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), tokens.zmbe.decimals)
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
          <Image src={`/images/tokens/${tokens.zmbe.symbol}.png`} width={24} height={24} alt={tokens.zmbe.symbol} />
          <Text ml="4px" bold>
            {tokens.zmbe.symbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onChange={handleStakeInputChange}
        currencyValue={`~${usdValueStaked || 0} USD`}
      />
      <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        Balance: {getFullDisplayBalance(stakingMax, tokens.zmbe.decimals)}
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
        <FeeSummary
          grave={grave}
          stakingTokenSymbol={tokens.zmbe.symbol}
          userData={userData}
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
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
      {!isRemovingStake && (
        <Button mt="8px" as="a" external href={BASE_EXCHANGE_URL} variant="secondary">
          {t('Get')} {tokens.zmbe.symbol}
        </Button>
      )}
    </Modal>
  )
}

export default GraveStakeModal
