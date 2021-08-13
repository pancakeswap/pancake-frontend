import React, { useEffect, useMemo, useState } from 'react'
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
  Text,
  BalanceInput,
  Slider,
  Box,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { ethers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { useWeb3React } from '@web3-react/core'
import { useGetMinBetAmount } from 'state/predictions/hooks'
import { useTranslation } from 'contexts/Localization'
import { usePredictionsContract } from 'hooks/useContract'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { BetPosition } from 'state/types'
import { formatBigNumber, formatFixedNumber } from 'utils/formatBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import PositionTag from '../PositionTag'
import useSwiper from '../../hooks/useSwiper'
import FlexRow from '../FlexRow'

interface SetPositionCardProps {
  position: BetPosition
  togglePosition: () => void
  onBack: () => void
  onSuccess: (decimalValue: string, hash: string) => Promise<void>
}

const dust = parseUnits('0.01', 18)
const percentShortcuts = [10, 25, 50, 75]

const getButtonProps = (
  value: ethers.BigNumber,
  bnbBalance: ethers.BigNumber,
  minBetAmountBalance: ethers.BigNumber,
) => {
  const hasSufficientBalance = () => {
    if (value.gt(0)) {
      return value.lte(bnbBalance)
    }
    return bnbBalance.gt(0)
  }

  if (!hasSufficientBalance()) {
    return { key: 'Insufficient BNB balance', disabled: true }
  }

  if (value.eq(0)) {
    return { key: 'Enter an amount', disabled: true }
  }

  return { key: 'Confirm', disabled: value.lt(minBetAmountBalance) }
}

const getValueAsEthersBn = (value: string) => {
  const valueAsFloat = parseFloat(value)
  return Number.isNaN(valueAsFloat) ? ethers.BigNumber.from(0) : parseUnits(value)
}

const SetPositionCard: React.FC<SetPositionCardProps> = ({ position, togglePosition, onBack, onSuccess }) => {
  const [value, setValue] = useState('')
  const [isTxPending, setIsTxPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [percent, setPercent] = useState(0)

  const { account } = useWeb3React()
  const { swiper } = useSwiper()
  const { balance: bnbBalance } = useGetBnbBalance()
  const minBetAmount = useGetMinBetAmount()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const predictionsContract = usePredictionsContract()

  // Convert bnb balance to ethers.BigNumber
  const bnbBalanceAsBn = useMemo(() => {
    return ethers.BigNumber.from(bnbBalance.toString())
  }, [bnbBalance])
  const maxBalance = useMemo(() => {
    return bnbBalanceAsBn.gt(dust) ? bnbBalanceAsBn.sub(dust) : dust
  }, [bnbBalanceAsBn])
  const balanceDisplay = formatBigNumber(bnbBalanceAsBn)

  const valueAsBn = getValueAsEthersBn(value)
  const showFieldWarning = account && valueAsBn.gt(0) && errorMessage !== null

  const handleInputChange = (input: string) => {
    const inputAsBn = getValueAsEthersBn(input)

    if (inputAsBn.eq(0)) {
      setPercent(0)
    } else {
      const inputAsFn = ethers.FixedNumber.from(inputAsBn)
      const maxValueAsFn = ethers.FixedNumber.from(maxBalance)
      const hundredAsFn = ethers.FixedNumber.from(100)
      const percentage = inputAsFn.divUnsafe(maxValueAsFn).mulUnsafe(hundredAsFn)
      const percentageAsFloat = percentage.toUnsafeFloat()

      setPercent(percentageAsFloat > 100 ? 100 : percentageAsFloat)
    }
    setValue(input)
  }

  const handlePercentChange = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const maxValueAsFn = ethers.FixedNumber.from(maxBalance)
      const hundredAsFn = ethers.FixedNumber.from(100)
      const sliderPercentAsFn = ethers.FixedNumber.from(sliderPercent.toFixed(18)).divUnsafe(hundredAsFn)
      const balancePercentage = maxValueAsFn.mulUnsafe(sliderPercentAsFn)
      setValue(formatFixedNumber(balancePercentage))
    } else {
      setValue('')
    }
    setPercent(sliderPercent)
  }

  // Clear value
  const handleGoBack = () => {
    setValue('')
    setPercent(0)
    onBack()
  }

  // Disable the swiper events to avoid conflicts
  const handleMouseOver = () => {
    swiper.keyboard.disable()
    swiper.mousewheel.disable()
    swiper.detachEvents()
  }

  const handleMouseOut = () => {
    swiper.keyboard.enable()
    swiper.mousewheel.enable()
    swiper.attachEvents()
  }

  const { key, disabled } = getButtonProps(valueAsBn, maxBalance, minBetAmount)

  const handleEnterPosition = async () => {
    const betMethod = position === BetPosition.BULL ? 'betBull' : 'betBear'

    try {
      const tx = await callWithGasPrice(predictionsContract, betMethod, undefined, { value: valueAsBn.toString() })
      setIsTxPending(true)
      const receipt = await tx.wait()
      onSuccess(valueAsBn.toString(), receipt.transactionHash as string)
    } catch {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsTxPending(false)
    }
  }

  // Warnings
  useEffect(() => {
    const inputAmount = getValueAsEthersBn(value)
    const hasSufficientBalance = inputAmount.gt(0) && inputAmount.lte(maxBalance)

    if (!hasSufficientBalance) {
      setErrorMessage({ key: 'Insufficient BNB balance' })
    } else if (inputAmount.gt(0) && inputAmount.lt(minBetAmount)) {
      setErrorMessage({
        key: 'A minimum amount of %num% %token% is required',
        data: { num: formatBigNumber(minBetAmount), token: 'BNB' },
      })
    } else {
      setErrorMessage(null)
    }
  }, [value, maxBalance, minBetAmount, setErrorMessage])

  return (
    <Card onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
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
            <BinanceIcon mr="4px  " />
            <Text bold textTransform="uppercase">
              BNB
            </Text>
          </Flex>
        </Flex>
        <BalanceInput
          value={value}
          onUserInput={handleInputChange}
          isWarning={showFieldWarning}
          inputProps={{ disabled: !account || isTxPending }}
        />
        {showFieldWarning && (
          <Text color="failure" fontSize="12px" mt="4px" textAlign="right">
            {t(errorMessage.key, errorMessage.data)}
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
          >
            {t('Max')}
          </Button>
        </Flex>
        <Box mb="8px">
          {account ? (
            <Button
              width="100%"
              disabled={!account || disabled}
              onClick={handleEnterPosition}
              isLoading={isTxPending}
              endIcon={isTxPending ? <AutoRenewIcon color="currentColor" spin /> : null}
            >
              {t(key)}
            </Button>
          ) : (
            <ConnectWalletButton width="100%" />
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
