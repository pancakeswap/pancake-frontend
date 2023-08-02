import { useTranslation } from '@pancakeswap/localization'
import {
  ModalV2,
  useModalV2,
  Modal,
  Flex,
  Text,
  BalanceInput,
  Slider,
  Box,
  PreTitle,
  Balance,
  IconButton,
  CalculateIcon,
  RoiCard,
  CalculatorMode,
} from '@pancakeswap/uikit'
import StyledButton from '@pancakeswap/uikit/src/components/Button/StyledButton'
import { getFullDisplayBalance, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import BigNumber from 'bignumber.js'
import useTokenBalance from 'hooks/useTokenBalance'
import { useCallback, useMemo, useState } from 'react'
import Divider from 'components/Divider'
import { LightGreyCard } from 'components/Card'
import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import toNumber from 'lodash/toNumber'
import { CurrencyLogo } from 'components/Logo'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { format, add } from 'date-fns'
import first from 'lodash/first'

import { FixedStakingPool } from '../type'
import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'

export function FixedStakingCalculator({
  stakingToken,
  pools,
  initialLockPeriod,
}: {
  stakingToken: Token
  pools: FixedStakingPool[]
  initialLockPeriod: number
}) {
  const { account } = useAccountActiveChain()

  const { t } = useTranslation()
  const stakeModal = useModalV2()
  const [stakeAmount, setStakeAmount] = useState('')

  const [lockPeriod, setLockPeriod] = useState(
    initialLockPeriod === null || initialLockPeriod === undefined ? first(pools).lockPeriod : initialLockPeriod,
  )

  const selectedPool = useMemo(() => pools.find((p) => p.lockPeriod === lockPeriod), [lockPeriod, pools])

  const { boostAPR, lockAPR } = useFixedStakeAPR(selectedPool)

  const [percent, setPercent] = useState(0)
  const { balance: stakingTokenBalance } = useTokenBalance(stakingToken?.address)

  const formattedUsdValueStaked = useStablecoinPriceAmount(stakingToken, toNumber(stakeAmount))

  const rawAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)

  const stakeCurrencyAmount = rawAmount.gt(0)
    ? CurrencyAmount.fromRawAmount(stakingToken, rawAmount.toString())
    : undefined

  const projectedReturnAmount = stakeCurrencyAmount
    ?.multiply(lockPeriod)
    ?.multiply(boostAPR.multiply(lockPeriod).divide(365))

  const formattedUsdProjectedReturnAmount = useStablecoinPriceAmount(
    stakingToken,
    toNumber(projectedReturnAmount?.toSignificant(2)),
  )

  const handleStakeInputChange = useCallback(
    (input: string) => {
      if (input) {
        const convertedInput = new BigNumber(input).multipliedBy(getFullDecimalMultiplier(stakingToken.decimals))
        const percentage = Math.floor(convertedInput.dividedBy(stakingTokenBalance).multipliedBy(100).toNumber())
        setPercent(percentage > 100 ? 100 : percentage)
      } else {
        setPercent(0)
      }
      setStakeAmount(input)
    },
    [stakingToken.decimals, stakingTokenBalance],
  )

  const handleChangePercent = useCallback(
    (sliderPercent: number) => {
      if (sliderPercent > 0) {
        const percentageOfStakingMax = stakingTokenBalance.dividedBy(100).multipliedBy(sliderPercent)
        const amountToStake = getFullDisplayBalance(
          percentageOfStakingMax,
          stakingToken.decimals,
          stakingToken.decimals,
        )
        setStakeAmount(amountToStake)
      } else {
        setStakeAmount('')
      }
      setPercent(sliderPercent)
    },
    [stakingToken.decimals, stakingTokenBalance],
  )

  return account ? (
    <>
      <IconButton variant="text" scale="sm" onClick={() => stakeModal.onOpen()}>
        <CalculateIcon color="textSubtle" ml="0.25em" width="24px" />
      </IconButton>
      <ModalV2 {...stakeModal} closeOnOverlayClick>
        <Modal title={t('Fixed Staking')} width={['100%', '100%', '420px']} maxWidth={['100%', , '420px']}>
          <Flex alignItems="center" justifyContent="space-between" mb="8px">
            <PreTitle textTransform="uppercase" bold>
              {t('Stake Amount')}
            </PreTitle>
            <Flex alignItems="center" minWidth="70px">
              <CurrencyLogo currency={stakingToken} size="24px" />
              <Text ml="4px" bold>
                {stakingToken.symbol}
              </Text>
            </Flex>
          </Flex>
          <BalanceInput
            value={stakeAmount}
            onUserInput={handleStakeInputChange}
            currencyValue={`~${formattedUsdValueStaked || 0} USD`}
            decimals={stakingToken.decimals}
          />
          <Text color="textSubtle" textAlign="right" fontSize="12px" m="8px 0">
            {t('Balance: %balance%', { balance: getFullDisplayBalance(stakingTokenBalance, stakingToken.decimals) })}
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
          <Flex alignItems="center" justifyContent="space-between" mt="8px" mb="16px">
            <StyledButton scale="xs" width="100%" mx="2px" variant="tertiary" onClick={() => handleChangePercent(25)}>
              25%
            </StyledButton>
            <StyledButton scale="xs" width="100%" mx="2px" variant="tertiary" onClick={() => handleChangePercent(50)}>
              50%
            </StyledButton>
            <StyledButton scale="xs" width="100%" mx="2px" variant="tertiary" onClick={() => handleChangePercent(75)}>
              75%
            </StyledButton>
            <StyledButton scale="xs" width="100%" mx="2px" variant="tertiary" onClick={() => handleChangePercent(100)}>
              {t('Max')}
            </StyledButton>
          </Flex>
          <Divider />

          {pools.length > 1 ? (
            <>
              <PreTitle textTransform="uppercase" bold mb="8px">
                {t('Stake Duration')}
              </PreTitle>
              <Flex mb="16px">
                {pools.map((pool) => (
                  <StyledButton
                    scale="md"
                    variant={pool.lockPeriod === lockPeriod ? 'danger' : 'bubblegum'}
                    width="100%"
                    mx="2px"
                    onClick={() => setLockPeriod(pool.lockPeriod)}
                  >
                    {pool.lockPeriod}D
                  </StyledButton>
                ))}
              </Flex>
            </>
          ) : null}

          <RoiCard
            earningTokenSymbol={stakingToken.symbol}
            calculatorState={{
              data: {
                roiUSD: formattedUsdProjectedReturnAmount || 0,
                roiTokens: projectedReturnAmount ? toNumber(projectedReturnAmount?.toSignificant(2)) : 0,
                roiPercentage: boostAPR ? toNumber(boostAPR?.toSignificant(2)) : 0,
              },
              controls: {
                mode: CalculatorMode.ROI_BASED_ON_PRINCIPAL,
              },
            }}
          />

          <Box mb="16px" mt="16px">
            <PreTitle textTransform="uppercase" bold mb="8px">
              {t('Position Overview')}
            </PreTitle>
            <LightGreyCard>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('Stake Amount')}
                </Text>
                <Balance bold fontSize="16px" decimals={2} value={toNumber(stakeAmount)} />
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('Duration')}
                </Text>
                <Text bold>
                  {lockPeriod} {t('days')}
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('APR')}
                </Text>
                <Text bold>{lockAPR?.toSignificant(2)}%</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('vCAKE Boost')}
                </Text>
                <Text bold>{boostAPR?.toSignificant(2)}%</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  Stake Period End
                </Text>
                <Text bold>{format(add(new Date(), { days: lockPeriod }), 'MMM d, yyyy hh:mm')}</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  Projected Return
                </Text>
                <Text bold>
                  {projectedReturnAmount?.toSignificant(2) ?? 0} {stakingToken.symbol}
                </Text>
              </Flex>
            </LightGreyCard>
          </Box>
        </Modal>
      </ModalV2>
    </>
  ) : (
    <ConnectWalletButton />
  )
}
