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
  AutoRenewIcon,
} from '@rug-zombie-libs/uikit'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useWeb3React } from '@web3-react/core'
import { useGetMinBetAmount } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { useMausoleum, usePredictionsContract } from 'hooks/useContract'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { BetPosition } from 'state/types'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import UnlockButton from 'components/UnlockButton'
import PositionTag from '../PositionTag'
import { getBnbAmount } from '../../helpers'
import useSwiper from '../../hooks/useSwiper'
import FlexRow from '../FlexRow'
import Card from './Card'
import { getBep20Contract, getErc721Contract, getMausoleumContract } from '../../../../utils/contractHelpers'
import { BIG_ZERO } from '../../../../utils/bigNumber'
import auctions from '../../../../redux/auctions'
import useWeb3 from '../../../../hooks/useWeb3'
import { auctionById } from '../../../../redux/get'

interface SetPositionCardProps {
  id: number
  position: BetPosition
  togglePosition: () => void
  onBack: () => void
  onSuccess: (decimalValue: BigNumber, hash: string) => Promise<void>
}

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
    return { id: 999, fallback: 'Insufficient BT balance', disabled: true }
  }

  if (value.eq(0) || value.isNaN()) {
    return { id: 999, fallback: 'Enter an amount', disabled: true }
  }
  return { id: 464, fallback: 'SUBMIT', disabled: value.lt(minBetAmountBalance) }
}

const SetPositionCard: React.FC<SetPositionCardProps> = ({ id, onBack, onSuccess }) => {
  const [value, setValue] = useState('')
  const [isTxPending, setIsTxPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const { account } = useWeb3React()
  const { swiper } = useSwiper()
  const minBetAmount = useGetMinBetAmount()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { aid, version, bidToken } = auctionById(id)
  const mausoleum = useMausoleum(version)

  const [maxBalance, setMaxBalance] = useState(0)
  const [bnMaxBalance, setBnMaxBalance] = useState(BIG_ZERO)
  const valueAsBn = new BigNumber(value)

  const percentageOfMaxBalance = valueAsBn.div(maxBalance).times(100).toNumber()
  const percentageDisplay = getPercentDisplay(percentageOfMaxBalance)
  const showFieldWarning = account && valueAsBn.gt(0) && errorMessage !== null
  const minBetAmountBalance = getBnbAmount(minBetAmount).toNumber()

  useEffect(() => {
    if (account && version !== 'v3') {
      getBep20Contract(bidToken).methods.balanceOf(account).call()
        .then(res => {
          setMaxBalance(new BigNumber(res).toNumber())
          setBnMaxBalance(new BigNumber(res))
        })
    }
  })

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const newValue = evt.target.value
    setValue(newValue)
  }

  const handleSliderChange = (newValue: number) => {
    setValue(newValue.toString())
  }

  const setMax = () => {
    setValue(getBalanceAmount(bnMaxBalance).toString())
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


  const { fallback, disabled } = getButtonProps(valueAsBn, new BigNumber(maxBalance), minBetAmountBalance)
  const handleEnterPosition = () => {
    let decimalValue = getDecimalAmount(valueAsBn)
    if (decimalValue.gt(maxBalance)) {
      decimalValue = new BigNumber(maxBalance)
    }

    (version === 'v3' ? mausoleum.methods.increaseBid(aid).send({ from: account, value: decimalValue }) :
      mausoleum.methods.increaseBid(aid, decimalValue).send({ from: account }))
      .once('sending', () => {
        setIsTxPending(true)
      })
      .once('receipt', async (result) => {
        setIsTxPending(false)
        onSuccess(decimalValue, result.transactionHash as string)
      })
      .once('error', (error) => {
        const errorMsg = t('An error occurred, unable to enter your position')

        toastError('Error!', error?.message)
        setIsTxPending(false)
        console.error(errorMsg, error)
      })
  }

  // Warnings
  useEffect(() => {
    const bnValue = new BigNumber(value)
    const hasSufficientBalance = bnValue.gt(0) && bnValue.lte(maxBalance)

    if (!hasSufficientBalance) {
      setErrorMessage({ id: 999, fallback: 'Insufficient BT balance' })
    } else if (bnValue.gt(0) && bnValue.lt(minBetAmountBalance)) {
      setErrorMessage({
        fallback: 'A minimum amount of %num% %token% is required',
        data: { num: minBetAmountBalance, token: 'BT' },
      })
    } else {
      setErrorMessage(null)
    }
  }, [value, maxBalance, minBetAmountBalance, setErrorMessage])

  return (
    <Card onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <CardHeader p='16px'>
        <Flex alignItems='center'>
          <IconButton variant='text' scale='sm' onClick={handleGoBack} mr='8px'>
            <ArrowBackIcon width='24px' />
          </IconButton>
          <FlexRow>
            <Heading size='md'>{t('Set Bid')}</Heading>
          </FlexRow>
        </Flex>
      </CardHeader>
      <CardBody py='16px'>
        <Flex alignItems='center' justifyContent='space-between' mb='8px'>
          <Text textAlign='right' color='textSubtle'>
            {t('Increase Bid by')}:
          </Text>
          <Flex alignItems='center'>
            <Text bold textTransform='uppercase'>
              {version === 'v3' ? 'BNB' : 'BT'}
            </Text>
          </Flex>
        </Flex>
        <BalanceInput
          value={value}
          onChange={handleChange}
          isWarning={showFieldWarning}
          inputProps={{ disabled: !account || isTxPending }}
        />
        {showFieldWarning && (
          <Text color='failure' fontSize='12px' mt='4px' textAlign='right'>
            {t(errorMessage.fallback, errorMessage.data)}
          </Text>
        )}
        <Text textAlign='right' mb='16px' color='textSubtle' fontSize='12px' style={{ height: '18px' }}>
          {account && t(`Balance: ${getBalanceAmount(new BigNumber(maxBalance))}`)}
        </Text>
        <Slider
          name='balance'
          min={0}
          max={getBalanceAmount(new BigNumber(maxBalance)).toNumber()}
          value={valueAsBn.lte(maxBalance) ? valueAsBn.toNumber() : 0}
          onValueChanged={handleSliderChange}
          valueLabel={account ? percentageDisplay : ''}
          disabled={!account || isTxPending}
          mb='4px'
        />
        <Flex alignItems='center' justifyContent='space-between' mb='16px'>
          {percentShortcuts.map((percent) => {
            const handleClick = () => {
              setValue(getBalanceAmount(new BigNumber(maxBalance)).times(percent / 100).toString())
            }

            return (
              <Button
                key={percent}
                scale='xs'
                variant='tertiary'
                onClick={handleClick}
                disabled={!account || isTxPending}
                style={{ flex: 1 }}
              >
                {`${percent}%`}
              </Button>
            )
          })}
          <Button scale='xs' variant='tertiary' onClick={setMax} disabled={!account || isTxPending}>
            {t('Max')}
          </Button>
        </Flex>
        <Box mb='8px'>
          {account ? (
            <Button
              width='100%'
              disabled={!account || disabled}
              onClick={handleEnterPosition}
              isLoading={isTxPending}
              endIcon={isTxPending ? <AutoRenewIcon color='currentColor' spin /> : null}
            >
              {t(fallback)}
            </Button>
          ) : (
            <UnlockButton width='100%' />
          )}
        </Box>
        <Text as='p' fontSize='12px' lineHeight={1} color='textSubtle'>
          {t('You can withdraw your full bid if you\'re outbid.')}
        </Text>
      </CardBody>
    </Card>
  )
}

export default SetPositionCard
