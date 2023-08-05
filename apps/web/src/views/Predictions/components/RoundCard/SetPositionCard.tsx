import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  ArrowBackIcon,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Button,
  BinanceIcon,
  LogoIcon,
  Text,
  BalanceInput,
  Slider,
  Box,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import BN from 'bignumber.js'
import { parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useGetMinBetAmount } from 'state/predictions/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { usePredictionsContract } from 'hooks/useContract'
import { useGetBnbBalance, useBSCCakeBalance } from 'hooks/useTokenBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { BetPosition } from 'state/types'
import { formatBigInt, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import useCakeApprovalStatus from 'hooks/useCakeApprovalStatus'
import useCakeApprove from 'hooks/useCakeApprove'

import PositionTag from '../PositionTag'
import FlexRow from '../FlexRow'

const LOGOS = {
  BNB: BinanceIcon,
  CAKE: LogoIcon,
}

interface SetPositionCardProps {
  position: BetPosition
  togglePosition: () => void
  epoch: number
  onBack: () => void
  onSuccess: (hash: string) => Promise<void>
}

const dust = parseUnits('0.001', 18)
const percentShortcuts = [10, 25, 50, 75]

const getButtonProps = (value: bigint, bnbBalance: bigint, minBetAmountBalance: bigint) => {
  const hasSufficientBalance = () => {
    if (value > 0) {
      return value <= bnbBalance
    }
    return bnbBalance > 0
  }

  if (!hasSufficientBalance()) {
    return { key: 'Insufficient %symbol% balance', disabled: true }
  }

  if (value === 0n) {
    return { key: 'Enter an amount', disabled: true }
  }

  return { key: 'Confirm', disabled: value < minBetAmountBalance }
}

const getValueAsEthersBn = (value: string) => {
  const valueAsFloat = parseFloat(value)
  return Number.isNaN(valueAsFloat) ? 0n : parseUnits(value as `${number}`, 18)
}

const TOKEN_BALANCE_CONFIG = {
  BNB: useGetBnbBalance,
  CAKE: useBSCCakeBalance,
} as const

const SetPositionCard: React.FC<React.PropsWithChildren<SetPositionCardProps>> = ({
  position,
  togglePosition,
  epoch,
  onBack,
  onSuccess,
}) => {
  const [value, setValue] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [percent, setPercent] = useState(0)

  const { address: account } = useAccount()
  const minBetAmount = useGetMinBetAmount()
  const { t } = useTranslation()
  const { fetchWithCatchTxError, loading: isTxPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { address: predictionsAddress, token } = useConfig()
  const predictionsContract = usePredictionsContract(predictionsAddress, token.symbol)
  const useTokenBalance = useMemo(() => {
    return TOKEN_BALANCE_CONFIG[token.symbol as keyof typeof TOKEN_BALANCE_CONFIG]
  }, [token.symbol])

  const { setLastUpdated, allowance } = useCakeApprovalStatus(token.symbol === 'CAKE' ? predictionsAddress : null)
  const { handleApprove, pendingTx } = useCakeApprove(
    setLastUpdated,
    predictionsAddress,
    t('You can now start prediction'),
  )

  const { balance: bnbBalance } = useTokenBalance()

  const maxBalance = useMemo(() => {
    return bnbBalance > dust ? bnbBalance - dust : 0n
  }, [bnbBalance])
  const balanceDisplay = formatBigInt(bnbBalance)

  const valueAsBn = getValueAsEthersBn(value)
  const showFieldWarning = account && valueAsBn > 0n && errorMessage !== null

  // BNB prediction doesn't need approval
  const doesCakeApprovePrediction = token.symbol === 'BNB' || allowance.gte(valueAsBn.toString())

  const handleInputChange = (input: string) => {
    const inputAsBn = getValueAsEthersBn(input)

    if (inputAsBn === 0n) {
      setPercent(0)
    } else {
      const inputAsFn = new BN(inputAsBn.toString())
      const maxValueAsFn = new BN(maxBalance.toString())
      const hundredAsFn = new BN(100)
      const percentage = inputAsFn.div(maxValueAsFn).times(hundredAsFn)
      const percentageAsFloat = percentage.toNumber()

      setPercent(percentageAsFloat > 100 ? 100 : percentageAsFloat)
    }
    setValue(input)
  }

  const handlePercentChange = useCallback(
    (sliderPercent: number) => {
      if (sliderPercent > 0) {
        const maxValueAsFn = new BN(maxBalance.toString())
        const hundredAsFn = new BN(100)
        const sliderPercentAsFn = new BN(sliderPercent.toFixed(18)).div(hundredAsFn)
        const balancePercentage = maxValueAsFn.times(sliderPercentAsFn)
        setValue(getFullDisplayBalance(balancePercentage, 18, 18))
      } else {
        setValue('')
      }
      setPercent(sliderPercent)
    },
    [maxBalance],
  )

  // Clear value
  const handleGoBack = () => {
    setValue('')
    setPercent(0)
    onBack()
  }

  const { key, disabled } = getButtonProps(valueAsBn, maxBalance, minBetAmount)

  const handleEnterPosition = async () => {
    const betMethod = position === BetPosition.BULL ? 'betBull' : 'betBear'
    const callOptions =
      token.symbol === 'CAKE'
        ? {
            gas: 300000n,
            value: 0n,
          }
        : { value: BigInt(valueAsBn.toString()) }

    const args = token.symbol === 'CAKE' ? [epoch, valueAsBn.toString()] : [epoch]

    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(predictionsContract as any, betMethod, args, callOptions)
    })
    if (receipt?.status) {
      onSuccess(receipt.transactionHash)
    }
  }

  // Warnings
  useEffect(() => {
    const inputAmount = getValueAsEthersBn(value)
    const hasSufficientBalance = inputAmount > 0n && inputAmount <= maxBalance

    if (!hasSufficientBalance) {
      setErrorMessage(t('Insufficient %symbol% balance', { symbol: token.symbol }))
    } else if (inputAmount > 0n && inputAmount < minBetAmount) {
      setErrorMessage(
        t('A minimum amount of %num% %token% is required', { num: formatBigInt(minBetAmount), token: token.symbol }),
      )
    } else {
      setErrorMessage(null)
    }
  }, [value, maxBalance, minBetAmount, setErrorMessage, t, token.symbol])

  const Logo = useMemo(() => {
    return LOGOS[token.symbol]
  }, [token.symbol])

  return (
    <Card>
      <CardHeader p="16px">
        <Flex alignItems="center">
          <IconButton variant="text" scale="sm" onClick={handleGoBack} mr="8px">
            <ArrowBackIcon width="24px" />
          </IconButton>
          <FlexRow>
            <Heading scale="md">{t('Set Position')}</Heading>
          </FlexRow>
          <PositionTag betPosition={position} onClick={togglePosition}>
            {position === BetPosition.BULL ? t('Up') : t('Down')}
          </PositionTag>
        </Flex>
      </CardHeader>
      <CardBody py="16px">
        <Flex alignItems="center" justifyContent="space-between" mb="8px">
          <Text textAlign="right" color="textSubtle">
            {t('Commit')}:
          </Text>
          <Flex alignItems="center">
            <Logo mr="4px" />
            <Text bold textTransform="uppercase">
              {token.symbol}
            </Text>
          </Flex>
        </Flex>
        <BalanceInput
          value={value}
          onUserInput={handleInputChange}
          isWarning={showFieldWarning}
          inputProps={{ disabled: !account || isTxPending }}
          className={!account || isTxPending ? '' : 'swiper-no-swiping'}
        />
        {showFieldWarning && (
          <Text color="failure" fontSize="12px" mt="4px" textAlign="right">
            {errorMessage}
          </Text>
        )}
        <Text textAlign="right" mb="16px" color="textSubtle" fontSize="12px" style={{ height: '18px' }}>
          {account && t('Balance: %balance%', { balance: balanceDisplay })}
        </Text>
        <Slider
          name="balance"
          min={0}
          max={100}
          value={percent}
          onValueChanged={handlePercentChange}
          valueLabel={account ? `${percent.toFixed(percent > 0 ? 1 : 0)}%` : ''}
          step={0.01}
          disabled={!account || isTxPending}
          mb="4px"
          className={!account || isTxPending ? '' : 'swiper-no-swiping'}
        />
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          {percentShortcuts.map((percentShortcut) => {
            const handleClick = () => {
              handlePercentChange(percentShortcut)
            }

            return (
              <Button
                key={percentShortcut}
                scale="xs"
                variant="tertiary"
                onClick={handleClick}
                disabled={!account || isTxPending}
                className={!account || isTxPending ? '' : 'swiper-no-swiping'}
                style={{ flex: 1 }}
              >
                {`${percentShortcut}%`}
              </Button>
            )
          })}
          <Button
            scale="xs"
            variant="tertiary"
            onClick={() => handlePercentChange(100)}
            disabled={!account || isTxPending}
            className={!account || isTxPending ? '' : 'swiper-no-swiping'}
          >
            {t('Max')}
          </Button>
        </Flex>
        <Box mb="8px">
          {account ? (
            doesCakeApprovePrediction ? (
              <Button
                width="100%"
                disabled={disabled}
                className={disabled ? '' : 'swiper-no-swiping'}
                onClick={handleEnterPosition}
                isLoading={isTxPending}
                endIcon={isTxPending ? <AutoRenewIcon color="currentColor" spin /> : null}
              >
                {t(key, { symbol: token.symbol })}
              </Button>
            ) : (
              <Button
                width="100%"
                className="swiper-no-swiping"
                onClick={handleApprove}
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon color="currentColor" spin /> : null}
              >
                {t('Enable')}
              </Button>
            )
          ) : (
            <ConnectWalletButton className="swiper-no-swiping" width="100%" />
          )}
        </Box>
        <Text as="p" fontSize="12px" lineHeight={1} color="textSubtle">
          {t('You won’t be able to remove or change your position once you enter it.')}
        </Text>
      </CardBody>
    </Card>
  )
}

export default SetPositionCard
