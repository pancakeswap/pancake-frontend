import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Text, Flex, Image, Button, Slider, BalanceInput, AutoRenewIcon } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import Web3 from 'web3'
import { GraveConfig } from '../../../../config/constants/types'
import tokens from '../../../../config/constants/tokens'
import EarlyWithdrawalFeeSummary from './EarlyWithdrawalFeeSummary'

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
const GraveWithdrawModal: React.FC<VaultStakeModalProps> = ({
                                                              grave,
                                                              stakingMax,
                                                              stakingTokenPrice,
                                                              account,
                                                              userData,
                                                              isRemovingStake = false,
                                                              onDismiss,
                                                              web3,
                                                            }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [percent, setPercent] = useState(0)
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

  const handleWithdrawalEarly = async (convertedStakeAmount: BigNumber) => {
    setPendingTx(true)
    // restorationChefContract.methods
    //   .withdrawZombieEarly(grave.gid)
    //   .send({ from: account })
    //   .on('sending', () => {
    //     setPendingTx(true)
    //   })
    //   .on('receipt', () => {
    //     toastSuccess(t('Unstaked!'), t('Your zombie is returned to your wallet'))
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

  const handleWithdrawal = async (convertedStakeAmount: BigNumber) => {
    setPendingTx(true)
    // restorationChefContract.methods
    //   .withdrawZombie(grave.gid)
    //   .send({ from: account })
    //   .on('sending', () => {
    //     setPendingTx(true)
    //   })
    //   .on('receipt', () => {
    //     toastSuccess(t('Unstaked!'), t('Your zombie is returned and NFT harvested to your wallet'))
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
    handleWithdrawalEarly(convertedStakeAmount)
  }

  const doneStaking = (Date.now() / 1000) >= userData.withdrawalDate
  const confirm = doneStaking ? 'Confirm' : `Confirm (${grave.earlyWithdrawalFee * 100}% Fee)`
  const zombieStaked = new BigNumber(userData.zombieStaked)
  const earlyWithdrawalFee = zombieStaked.times(0.05)

  const usdValueStaked = getFullDisplayBalance(zombieStaked.times(stakingTokenPrice), tokens.zmbe.decimals)

  return (
    <Modal
      title={doneStaking ? 'Unstake & Harvest NFT' : 'Withdraw Early'}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Flex alignItems='center' justifyContent='space-between' mb='8px'>
        <Text bold>Unstake:</Text>
        <Flex alignItems='center' minWidth='70px'>
          <Image src={`/images/tokens/${tokens.zmbe.symbol}.png`} width={24} height={24} alt={tokens.zmbe.symbol} />
          <Text ml='4px' bold>
            {tokens.zmbe.symbol}
          </Text>
        </Flex>
      </Flex>
      <br/>
      <Text>
        Zombie Staked: {getFullDisplayBalance(stakingMax, tokens.zmbe.decimals)}
      </Text>
      <Text mt='8px' color='textSubtle' fontSize='12px' mb='8px'>
        {`~${usdValueStaked || 0} USD`}
      </Text>
      <EarlyWithdrawalFeeSummary
        grave={grave}
        stakingTokenSymbol={tokens.zmbe.symbol}
        userData={userData}
        feeInZombie={earlyWithdrawalFee}
      />

      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color='currentColor' /> : null}
        onClick={handleConfirmClick}
        mt='24px'
      >
        {pendingTx ? t('Confirming') : confirm}
      </Button>
    </Modal>
  )
}

export default GraveWithdrawModal
