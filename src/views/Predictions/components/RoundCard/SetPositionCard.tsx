import React, { useEffect, useState } from 'react'
import {
  ArrowBackIcon,
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
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useWeb3React } from '@web3-react/core'
import { useGetMinBetAmount } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { usePredictionsContract } from 'hooks/useContract'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { BetPosition } from 'state/types'
import { getDecimalAmount } from 'utils/formatBalance'
import UnlockButton from 'components/UnlockButton'
import { BIG_NINE, BIG_TEN } from 'utils/bigNumber'
import PositionTag from '../PositionTag'
import { getBnbAmount } from '../../helpers'
import useSwiper from '../../hooks/useSwiper'
import FlexRow from '../FlexRow'
import Card from './Card'

interface SetPositionCardProps {
  position: BetPosition
  togglePosition: () => void
  onBack: () => void
  onSuccess: (decimalValue: BigNumber, hash: string) => Promise<void>
}

// /!\ TEMPORARY /!\
// Set default gasPrice (6 gwei) when calling BetBull/BetBear before new contract is released fixing this 'issue'.
// TODO: Remove on beta-v2 smart contract release.
const gasPrice = new BigNumber(6).times(BIG_TEN.pow(BIG_NINE)).toString()

const dust = new BigNumber(0.01).times(DEFAULT_TOKEN_DECIMAL)
const percentShortcuts = [10, 25, 50, 75]

const getPercentDisplay = (percentage: number) => {
  if (Number.isNaN(percentage)) {
    return ''
  }

  if (percentage > 100) {
    return ''
  }

  if (percentage < 0) {
    return ''
  }

  return `${percentage.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`
}

const getButtonProps = (value: BigNumber, bnbBalance: BigNumber, minBetAmountBalance: number) => {
  if (bnbBalance.eq(0)) {
    return { key: 'Insufficient BNB balance', disabled: true }
  }

  if (value.eq(0) || value.isNaN()) {
    return { key: 'Enter an amount', disabled: true }
  }
  return { key: 'Confirm', disabled: value.lt(minBetAmountBalance) }
}

const SetPositionCard: React.FC<SetPositionCardProps> = ({ position, togglePosition, onBack, onSuccess }) => {
  const [value, setValue] = useState('')
  const [isTxPending, setIsTxPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const { account } = useWeb3React()
  const { swiper } = useSwiper()
  const { balance: bnbBalance } = useGetBnbBalance()
  const minBetAmount = useGetMinBetAmount()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const predictionsContract = usePredictionsContract()

  const balanceDisplay = getBnbAmount(bnbBalance).toNumber()
  const maxBalance = getBnbAmount(bnbBalance.gt(dust) ? bnbBalance.minus(dust) : bnbBalance).toNumber()
  const valueAsBn = new BigNumber(value)

  const percentageOfMaxBalance = valueAsBn.div(maxBalance).times(100).toNumber()
  const percentageDisplay = getPercentDisplay(percentageOfMaxBalance)
  const showFieldWarning = account && valueAsBn.gt(0) && errorMessage !== null
  const minBetAmountBalance = getBnbAmount(minBetAmount).toNumber()

  const handleChange = (input) => {
    setValue(input)
  }

  const handleSliderChange = (newValue: number) => {
    setValue(newValue.toString())
  }

  const setMax = () => {
    setValue(maxBalance.toString())
  }

  // Clear value
  const handleGoBack = () => {
    setValue('')
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

  const { key, disabled } = getButtonProps(valueAsBn, bnbBalance, minBetAmountBalance)

  const handleEnterPosition = () => {
    const betMethod = position === BetPosition.BULL ? 'betBull' : 'betBear'
    const decimalValue = getDecimalAmount(valueAsBn)

    predictionsContract.methods[betMethod]()
      .send({ from: account, value: decimalValue, gasPrice })
      .once('sending', () => {
        setIsTxPending(true)
      })
      .once('receipt', async (result) => {
        setIsTxPending(false)
        onSuccess(decimalValue, result.transactionHash as string)
      })
      .once('error', (error) => {
        const errorMsg = t('An error occurred, unable to enter your position')

        toastError(t('Error'), error?.message)
        setIsTxPending(false)
        console.error(errorMsg, error)
      })
  }

  // Warnings
  useEffect(() => {
    const bnValue = new BigNumber(value)
    const hasSufficientBalance = bnValue.gt(0) && bnValue.lte(maxBalance)

    if (!hasSufficientBalance) {
      setErrorMessage({ key: 'Insufficient BNB balance' })
    } else if (bnValue.gt(0) && bnValue.lt(minBetAmountBalance)) {
      setErrorMessage({
        key: 'A minimum amount of %num% %token% is required',
        data: { num: minBetAmountBalance, token: 'BNB' },
      })
    } else {
      setErrorMessage(null)
    }
  }, [value, maxBalance, minBetAmountBalance, setErrorMessage])

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
          onUserInput={handleChange}
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
          max={maxBalance}
          value={valueAsBn.lte(maxBalance) ? valueAsBn.toNumber() : 0}
          onValueChanged={handleSliderChange}
          step={0.000000000000001}
          valueLabel={account ? percentageDisplay : ''}
          disabled={!account || isTxPending}
          mb="4px"
        />
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          {percentShortcuts.map((percent) => {
            const handleClick = () => {
              setValue(((percent / 100) * maxBalance).toString())
            }

            return (
              <Button
                key={percent}
                scale="xs"
                variant="tertiary"
                onClick={handleClick}
                disabled={!account || isTxPending}
                style={{ flex: 1 }}
              >
                {`${percent}%`}
              </Button>
            )
          })}
          <Button scale="xs" variant="tertiary" onClick={setMax} disabled={!account || isTxPending}>
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
            <UnlockButton width="100%" />
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
