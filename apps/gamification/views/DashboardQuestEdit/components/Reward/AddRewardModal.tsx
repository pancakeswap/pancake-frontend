import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { Box, Button, Flex, InjectedModalProps, Input, Modal, Text } from '@pancakeswap/uikit'
import { getDecimalAmount, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { BigNumber } from 'bignumber.js'
import { CurrencyInputPanel } from 'components/CurrencyInputPanel'
import { CurrencySearch } from 'components/SearchModal/CurrencySearch'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useCurrencyBalance } from 'hooks/useTokenBalance'
import { useTokensByChainWithNativeToken } from 'hooks/useTokensByChainWithNativeToken'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { styled } from 'styled-components'
import { LongPressSvg } from 'views/DashboardQuestEdit/components/SubmitAction/LongPressSvg'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'
import { useQuestRewardApprovalStatus } from 'views/DashboardQuestEdit/hooks/useQuestRewardApprovalStatus'
import { EnableButton } from './EnableButton'
import { WarningInfo } from './WarningInfo'

const YellowButton = styled(Button)`
  color: white;
  background-color: ${({ theme }) => theme.colors.warning};

  &:disabled {
    svg {
      opacity: 0.2;
    }
  }
`

export enum CurrencyModalView {
  search,
  currencyInput,
}

interface ModalConfig {
  title: string
  onBack: () => void
}

interface AddRewardModalProps extends InjectedModalProps {
  reward: undefined | QuestRewardType
  amountOfWinners: number
  handlePickedRewardToken: (value: Currency, totalRewardAmount: number, amountOfWinnersInModal: number) => void
}

const DURATION = 3000 // 3s

export const AddRewardModal: React.FC<React.PropsWithChildren<AddRewardModalProps>> = ({
  reward,
  amountOfWinners,
  handlePickedRewardToken,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { switchNetworkAsync } = useSwitchNetwork()
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.currencyInput)
  const [amountOfWinnersInModal, setAmountOfWinnersInModal] = useState(0)
  const { chainId } = useActiveWeb3React()
  const tokensByChainWithNativeToken = useTokensByChainWithNativeToken(reward?.currency?.network as ChainId)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (amountOfWinners) {
      setAmountOfWinnersInModal(amountOfWinners)
    }
  }, [])

  const startLongPress = () => {
    timerRef.current = window.setTimeout(() => {
      setProgress(100)
      handleContinue()
    }, DURATION)

    let start: number | null = null
    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const percentage = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(percentage)

      if (elapsed < DURATION) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  const endLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setProgress(0)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const defaultInputCurrency = useMemo((): Currency => {
    const findToken = tokensByChainWithNativeToken.find((i) =>
      i.isNative
        ? i.wrapped.address.toLowerCase() === reward?.currency?.address?.toLowerCase()
        : i.address.toLowerCase() === reward?.currency?.address?.toLowerCase(),
    )
    return findToken || (CAKE as any)?.[chainId]
  }, [chainId, reward, tokensByChainWithNativeToken])

  const displayAmountOfWinnersInModal = useMemo(() => amountOfWinnersInModal || '', [amountOfWinnersInModal])

  const [inputCurrency, setInputCurrency] = useState<Currency>(defaultInputCurrency)
  const [stakeAmount, setStakeAmount] = useState(reward?.totalRewardAmount?.toString() ?? '')
  const nativeToken = useNativeCurrency(inputCurrency.chainId)

  const currencyBalance = useCurrencyBalance(inputCurrency)

  const config = {
    [CurrencyModalView.currencyInput]: { title: t('Add a reward'), onBack: onDismiss },
    [CurrencyModalView.search]: {
      title: 'Select a Token',
      onBack: () => setModalView(CurrencyModalView.currencyInput),
    },
  } as { [key in number]: ModalConfig }

  const handleMaxInput = useCallback(() => {
    const newBalanceAmount = getFullDisplayBalance(currencyBalance, inputCurrency.decimals).toString()
    setStakeAmount(newBalanceAmount)
  }, [currencyBalance, inputCurrency])

  const handlePercentButton = useCallback(
    (percent: number) => {
      const amount = currencyBalance.multipliedBy(new BigNumber(percent).div(100))
      const newBalanceAmount = getFullDisplayBalance(amount, inputCurrency.decimals).toString()
      setStakeAmount(newBalanceAmount)
    },
    [currencyBalance, inputCurrency.decimals],
  )

  const handleInputSelect = useCallback((newCurrency: Currency) => {
    setInputCurrency(newCurrency)
    setModalView(CurrencyModalView.currencyInput)
  }, [])

  const handleInputAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      setAmountOfWinnersInModal(Number(e.target.value))
    }
  }, [])

  const handleContinue = () => {
    handlePickedRewardToken(inputCurrency, Number(stakeAmount), displayAmountOfWinnersInModal || 0)
    onDismiss?.()
  }

  const isNetworkWrong = useMemo(() => chainId !== inputCurrency?.chainId, [chainId, inputCurrency])

  const handleSwitchNetwork = async (): Promise<void> => {
    await switchNetworkAsync(inputCurrency?.chainId)
  }

  const isRewardDistribution = useMemo(() => {
    const rewardAmount = new BigNumber(stakeAmount)
    const totalWinners = new BigNumber(amountOfWinnersInModal)
    const perUserWin = rewardAmount.div(totalWinners)
    return (rewardAmount.gt(0) && totalWinners.eq(1)) || rewardAmount.eq(perUserWin.times(totalWinners))
  }, [amountOfWinnersInModal, stakeAmount])

  const isAbleToSubmit = useMemo(() => {
    const userBalance = new BigNumber(getFullDisplayBalance(currencyBalance, inputCurrency.decimals))
    const isInputLowerThanBalance = new BigNumber(stakeAmount).lte(userBalance)

    return Boolean(
      !inputCurrency ||
        new BigNumber(stakeAmount).lte(0) ||
        !displayAmountOfWinnersInModal ||
        !isInputLowerThanBalance ||
        !isRewardDistribution,
    )
  }, [currencyBalance, displayAmountOfWinnersInModal, inputCurrency, stakeAmount, isRewardDistribution])

  // Approve
  const tokenAddress = inputCurrency.isNative ? inputCurrency.wrapped.address : inputCurrency.address
  const { allowance, setLastUpdated } = useQuestRewardApprovalStatus(tokenAddress, inputCurrency.chainId)

  const needEnable = useMemo(() => {
    if (!inputCurrency.isNative && nativeToken.wrapped.address.toLowerCase() !== tokenAddress.toLowerCase()) {
      const amount = getDecimalAmount(new BigNumber(stakeAmount), inputCurrency.decimals)
      return amount.gt(allowance)
    }
    return false
  }, [allowance, inputCurrency, tokenAddress, nativeToken, stakeAmount])

  return (
    <Modal title={config[modalView].title} onDismiss={config[modalView].onBack}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '380px']}
      >
        {modalView === CurrencyModalView.currencyInput && (
          <>
            <Box width="100%">
              <WarningInfo />
              <CurrencyInputPanel
                id="currency-input"
                showMaxButton
                showLogoWithChain
                showQuickInputButton
                value={stakeAmount}
                currency={inputCurrency}
                maxAmount={currencyBalance}
                onMax={handleMaxInput}
                onUserInput={setStakeAmount}
                onPercentInput={handlePercentButton}
                onCurrencySelect={handleInputSelect}
                onPressCustomModal={() => setModalView(CurrencyModalView.search)}
              />
              <Flex justifyContent="center" mt="32px">
                <Text style={{ alignSelf: 'center' }} fontSize="14px" color="textSubtle" mr="8px">
                  {t('Select Number of Winners:')}
                </Text>
                <Box width="80px">
                  <Input
                    pattern="^[0-9]+$"
                    inputMode="numeric"
                    value={displayAmountOfWinnersInModal}
                    onChange={handleInputAmount}
                  />
                </Box>
              </Flex>
            </Box>
            {!isRewardDistribution && (
              <Text mt="8px" fontSize="14px" color="failure">
                {t('The reward cannot be distributed evenly.')}
              </Text>
            )}
            {isNetworkWrong ? (
              <Button width="100%" mt="24px" onClick={handleSwitchNetwork}>
                {t('Switch Network')}
              </Button>
            ) : needEnable ? (
              <EnableButton currency={inputCurrency} setLastUpdated={setLastUpdated} />
            ) : (
              <YellowButton
                width="100%"
                mt="24px"
                onMouseDown={startLongPress}
                onTouchStart={startLongPress}
                onMouseUp={endLongPress}
                onMouseLeave={endLongPress}
                onTouchEnd={endLongPress}
                endIcon={<LongPressSvg progress={progress} />}
                disabled={isAbleToSubmit}
              >
                {t('Hold to deposit')}
              </YellowButton>
            )}
          </>
        )}
        {modalView === CurrencyModalView.search && (
          <Box width="100%">
            <CurrencySearch selectedCurrency={inputCurrency} onCurrencySelect={handleInputSelect} />
          </Box>
        )}
      </Flex>
    </Modal>
  )
}
