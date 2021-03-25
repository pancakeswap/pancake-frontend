import React, { ChangeEventHandler, useEffect, useState } from 'react'
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
} from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import useGetBnbBalance from 'hooks/useGetBnbBalance'
import UnlockButton from 'components/UnlockButton'
import { BetPosition } from 'state/types'
import { getBnbAmount } from '../../helpers'
import useSwiper from '../../hooks/useSwiper'
import FlexRow from '../FlexRow'
import { PositionTag } from './Tag'
import Card from './Card'

interface SetPositionCardProps {
  defaultPosition: BetPosition
  onBack: () => void
}

const dust = new BigNumber(0.01).times(new BigNumber(10).pow(18))
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

const SetPositionCard: React.FC<SetPositionCardProps> = ({ defaultPosition, onBack }) => {
  const [position, setPosition] = useState<BetPosition>(defaultPosition)
  const [value, setValue] = useState('')
  const [hasSufficientBalance, setHasSufficientBalance] = useState(true)
  const { swiper } = useSwiper()
  const bnbBalance = useGetBnbBalance()
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const balanceDisplay = getBnbAmount(bnbBalance).toNumber()
  const maxBalance = getBnbAmount(bnbBalance.minus(dust)).toNumber()
  const valueAsFloat = parseFloat(value)
  const percentageOfMaxBalance = (valueAsFloat / maxBalance) * 100
  const percentageDisplay = getPercentDisplay(percentageOfMaxBalance)
  const showFieldWarning = account && valueAsFloat > 0 && !hasSufficientBalance

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const newValue = evt.target.value
    setValue(newValue)
  }

  const handleSliderChange = (newValue: number) => {
    setValue(newValue.toString())
  }

  const togglePosition = () => {
    setPosition(position === BetPosition.BULL ? BetPosition.BEAR : BetPosition.BULL)
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

  useEffect(() => {
    setHasSufficientBalance(valueAsFloat > 0 && valueAsFloat <= maxBalance)
  }, [valueAsFloat, maxBalance, setHasSufficientBalance])

  return (
    <Card onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <CardHeader p="8px">
        <Flex alignItems="center">
          <IconButton variant="text" onClick={handleGoBack}>
            <ArrowBackIcon width="24px" />
          </IconButton>
          <FlexRow>
            <Heading size="md">{TranslateString(999, 'Set Position')}</Heading>
          </FlexRow>
          <PositionTag betPosition={position} onClick={togglePosition}>
            {position === BetPosition.BULL ? TranslateString(999, 'Up') : TranslateString(999, 'Down')}
          </PositionTag>
        </Flex>
      </CardHeader>
      <CardBody py="16px">
        <Flex alignItems="center" justifyContent="space-between" mb="8px">
          <Text textAlign="right" color="textSubtle">
            {TranslateString(999, 'Commit')}:
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
          onChange={handleChange}
          isWarning={showFieldWarning}
          inputProps={{ disabled: !account }}
        />
        {showFieldWarning && (
          <Text color="failure" fontSize="12px" mt="4px" textAlign="right">
            {TranslateString(999, 'Insufficient BNB balance')}
          </Text>
        )}
        <Text textAlign="right" mb="16px" color="textSubtle" fontSize="12px" style={{ height: '18px' }}>
          {account && TranslateString(999, `Balance: ${balanceDisplay}`, { num: balanceDisplay })}
        </Text>
        <Slider
          name="balance"
          min={0}
          max={maxBalance}
          value={valueAsFloat <= maxBalance ? valueAsFloat : 0}
          onValueChanged={handleSliderChange}
          valueLabel={account ? percentageDisplay : ''}
          disabled={!account}
          mb="4px"
        />
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          {percentShortcuts.map((percent) => {
            const handleClick = () => {
              setValue(((percent / 100) * maxBalance).toString())
            }

            return (
              <Button key={percent} scale="xs" variant="tertiary" onClick={handleClick} disabled={!account}>
                {`${percent}%`}
              </Button>
            )
          })}
          <Button scale="xs" variant="tertiary" onClick={setMax} disabled={!account}>
            {TranslateString(452, 'Max')}
          </Button>
        </Flex>
        <Box mb="8px">
          {account ? (
            <Button width="100%" disabled={hasSufficientBalance || valueAsFloat <= 0}>
              {TranslateString(464, 'Confirm')}
            </Button>
          ) : (
            <UnlockButton width="100%" />
          )}
        </Box>
        <Text as="p" fontSize="12px" lineHeight={1} color="textSubtle">
          {TranslateString(999, "You won't be able to remove or change your position once you enter it.")}
        </Text>
      </CardBody>
    </Card>
  )
}

export default SetPositionCard
