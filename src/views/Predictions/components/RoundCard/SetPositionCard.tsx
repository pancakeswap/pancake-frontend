import React, { useState } from 'react'
import SwiperCore from 'swiper'
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
import { Position } from 'state/types'
import { getBnbAmount } from '../../helpers'
import FlexRow from '../FlexRow'
import { PositionTag } from './Tag'
import Card from './Card'

interface SetPositionCardProps {
  defaultPosition: Position
  onBack: () => void
  swiperInstance: SwiperCore
}

const dust = new BigNumber(0.01).times(new BigNumber(10).pow(18))
const percentShortcuts = [10, 25, 50, 75]

const SetPositionCard: React.FC<SetPositionCardProps> = ({ defaultPosition, onBack, swiperInstance }) => {
  const [position, setPosition] = useState<Position>(defaultPosition)
  const [value, setValue] = useState(0)
  const bnbBalance = useGetBnbBalance()
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const balanceDisplay = getBnbAmount(bnbBalance).toNumber()
  const maxBalance = getBnbAmount(bnbBalance.minus(dust)).toNumber()

  const handleChange = (evt) => {
    const newValue = evt.target.value
    setValue(newValue)
  }

  const handleSliderChange = (newValue: number) => {
    setValue(newValue)
  }

  const togglePosition = () => {
    setPosition(position === Position.UP ? Position.DOWN : Position.UP)
  }

  const setMax = () => {
    setValue(maxBalance)
  }

  // Disable the swiper events to avoid conflicts
  const handleMouseOver = () => {
    swiperInstance.keyboard.disable()
    swiperInstance.mousewheel.disable()
    swiperInstance.detachEvents()
  }

  const handleMouseOut = () => {
    swiperInstance.keyboard.enable()
    swiperInstance.mousewheel.enable()
    swiperInstance.attachEvents()
  }

  return (
    <Card onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <CardHeader p="8px">
        <Flex alignItems="center">
          <IconButton variant="text" onClick={onBack}>
            <ArrowBackIcon width="24px" />
          </IconButton>
          <FlexRow>
            <Heading size="md">{TranslateString(999, 'Set Position')}</Heading>
          </FlexRow>
          <PositionTag roundPosition={position} onClick={togglePosition}>
            {position === Position.UP ? TranslateString(999, 'Up') : TranslateString(999, 'Down')}
          </PositionTag>
        </Flex>
      </CardHeader>
      <CardBody>
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
        <BalanceInput value={value} onChange={handleChange} inputProps={{ disabled: !account }} />
        <Text textAlign="right" mb="16px" color="textSubtle" fontSize="12px" style={{ height: '18px' }}>
          {account && TranslateString(999, `Balance: ${balanceDisplay}`, { num: balanceDisplay })}
        </Text>
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          {percentShortcuts.map((percent) => {
            const handleClick = () => {
              setValue((percent / 100) * maxBalance)
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
        <Slider min={0} max={maxBalance} value={value} onValueChanged={handleSliderChange} mb="16px" />
        <Box mb="16px">
          {account ? <Button width="100%">{TranslateString(464, 'Confirm')}</Button> : <UnlockButton width="100%" />}
        </Box>
        <Text as="p" fontSize="12px" lineHeight={1} color="textSubtle">
          {TranslateString(999, "You won't be able to remove or change your position once you enter it.")}
        </Text>
      </CardBody>
    </Card>
  )
}

export default SetPositionCard
