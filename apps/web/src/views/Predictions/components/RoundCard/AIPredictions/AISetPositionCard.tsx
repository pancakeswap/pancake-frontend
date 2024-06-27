import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import {
  ArrowBackIcon,
  AutoRenewIcon,
  BalanceInput,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Slider,
  Text,
} from '@pancakeswap/uikit'
import { formatBigInt, formatNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { TokenImage } from 'components/TokenImage'
import useCakeApprovalStatus from 'hooks/useCakeApprovalStatus'
import useCakeApprove from 'hooks/useCakeApprove'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePredictionsContract } from 'hooks/useContract'
import { useGetNativeTokenBalance, useTokenBalanceByChain } from 'hooks/useTokenBalance'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGetMinBetAmount } from 'state/predictions/hooks'
import { Address, parseUnits } from 'viem'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { useAccount } from 'wagmi'

import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import FlexRow from '../../FlexRow'
import { AIPositionTag } from './AIPositionTag'

interface AISetPositionCardProps {
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

export const AISetPositionCard: React.FC<React.PropsWithChildren<AISetPositionCardProps>> = ({
  position,
  togglePosition,
  epoch,
  onBack,
  onSuccess,
}) => {
  const [value, setValue] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [percent, setPercent] = useState(0)

  const { address: account } = useAccount()
  const minBetAmount = useGetMinBetAmount()
  const { t } = useTranslation()
  const { fetchWithCatchTxError, loading: isTxPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const config = useConfig()
  const predictionsAddress = config?.address ?? '0x'
  const isNativeToken = config?.isNativeToken ?? false
  const tokenSymbol = config?.token?.symbol ?? ''

  const predictionsContract = usePredictionsContract(predictionsAddress, isNativeToken)

  const { setLastUpdated, allowance } = useCakeApprovalStatus(config?.isNativeToken ? null : predictionsAddress)
  const { handleApprove, pendingTx } = useCakeApprove(
    setLastUpdated,
    predictionsAddress,
    t('You can now start prediction'),
  )

  const { balance: userBalance } = useTokenBalanceByChain(config?.token?.address as Address)
  const { balance: userNativeTokenBalance } = useGetNativeTokenBalance()

  const balance = useMemo(() => {
    if (isNativeToken) {
      return BigInt(userNativeTokenBalance.toString()) ?? 0n
    }
    return BigInt(userBalance.toString()) ?? 0n
  }, [isNativeToken, userNativeTokenBalance, userBalance])

  const maxBalance = useMemo(() => (balance > dust ? balance - dust : 0n), [balance])
  const balanceDisplay = formatBigInt(balance, config?.token?.decimals, config?.token?.decimals)

  const valueAsBn = getValueAsEthersBn(value)
  const showFieldWarning = account && valueAsBn > 0n && errorMessage !== null

  const { data: tokenPrice } = useCurrencyUsdPrice(config?.token)
  const usdValue = useMemo(() => {
    if (!tokenPrice || !Number(value)) return ''

    const rawUsdValue = new BN(value).times(tokenPrice)
    if (rawUsdValue.isNaN()) return ''

    return `~$${formatNumber(rawUsdValue.toNumber(), 2, 4)}`
  }, [tokenPrice, value])

  // Native Token prediction doesn't need approval
  const doesCakeApprovePrediction = isNativeToken || allowance.gte(valueAsBn.toString())

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
    const callOptions = !isNativeToken
      ? {
          gas: 300000n,
          value: 0n,
        }
      : { value: BigInt(valueAsBn.toString()) }

    const args = !isNativeToken ? [epoch, valueAsBn.toString()] : [epoch]

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
      setErrorMessage(t('Insufficient %symbol% balance', { symbol: tokenSymbol }))
    } else if (inputAmount > 0n && inputAmount < minBetAmount) {
      setErrorMessage(
        t('A minimum amount of %num% %token% is required', { num: formatBigInt(minBetAmount), token: tokenSymbol }),
      )
    } else {
      setErrorMessage(null)
    }
  }, [value, maxBalance, minBetAmount, setErrorMessage, t, tokenSymbol])

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
          <AIPositionTag betPosition={position} onClick={togglePosition} showIcon>
            {position === BetPosition.BULL ? t('Follow AI') : t('Against AI')}
          </AIPositionTag>
        </Flex>
      </CardHeader>
      <CardBody py="16px">
        <Flex alignItems="center" justifyContent="space-between" mb="8px">
          <Text textAlign="right" color="textSubtle">
            {t('Commit')}:
          </Text>
          <Flex alignItems="center">
            <Box mr="4px" width={20} height={20}>
              {config?.token && <TokenImage width={20} height={20} token={config?.token} />}
            </Box>
            <Text bold textTransform="uppercase">
              {tokenSymbol}
            </Text>
          </Flex>
        </Flex>
        <BalanceInput
          value={value}
          currencyValue={
            usdValue && (
              <Text fontSize="12px" textAlign="right" color="textSubtle" ellipsis>
                {usdValue}
              </Text>
            )
          }
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
                {t(key, { symbol: tokenSymbol })}
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
