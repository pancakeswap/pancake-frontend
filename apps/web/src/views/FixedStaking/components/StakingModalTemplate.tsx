import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import {
  BalanceInput,
  Box,
  Button,
  Flex,
  Link,
  Message,
  MessageText,
  Modal,
  PreTitle,
  Slider,
  Text,
  Toggle,
  useToast,
} from '@pancakeswap/uikit'
import { getDecimalAmount, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import BigNumber from 'bignumber.js'
import Divider from 'components/Divider'
import { CurrencyLogo } from 'components/Logo'
import { ToastDescriptionWithTx } from 'components/Toast'
import dayjs from 'dayjs'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useFixedStakingContract } from 'hooks/useContract'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useStablecoinPriceAmount } from 'hooks/useStablecoinPrice'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import first from 'lodash/first'
import toNumber from 'lodash/toNumber'
import { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import usePrevious from 'views/V3Info/hooks/usePrevious'

import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'
import useIsBoost from '../hooks/useIsBoost'
import { FixedStakingPool, StakedPosition } from '../type'
import { DisclaimerCheckBox } from './DisclaimerCheckBox'
import { ModalTitle } from './ModalTitle'
import { StakeConfirmModal } from './StakeConfirmModal'

const StyledButton = styled(Button)`
  flex-grow: 1;
`

interface BodyParam {
  setLockPeriod: Dispatch<SetStateAction<number>>
  stakeCurrencyAmount: CurrencyAmount<Currency>
  alreadyStakedAmount: CurrencyAmount<Currency>
  positionStakeCurrencyAmount: CurrencyAmount<Currency>
  lockPeriod: number
  isStaked: boolean
  boostAPR: Percent
  lockAPR: Percent
  unlockAPR: Percent
  poolEndDay: number
  isBoost: boolean
  lastDayAction: number
}

export function StakingModalTemplate({
  stakingToken: positionStakingToken,
  pools,
  initialLockPeriod,
  stakedPeriods,
  body,
  head,
  hideStakeButton,
  stakedPositions = [],
  onBack,
  title,
  useNative,
}: {
  title?: string
  stakingToken: Currency
  pools: FixedStakingPool[]
  stakedPositions?: StakedPosition[]
  initialLockPeriod?: number
  stakedPeriods: number[]
  head?: () => ReactNode
  body: ReactNode | ((params: BodyParam) => ReactNode)
  hideStakeButton?: boolean
  onBack?: () => void
  useNative?: boolean
}) {
  const { t } = useTranslation()
  const [stakeAmount, setStakeAmount] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [check, setCheck] = useState(false)
  const [useBNB, toggleUseBNB] = useState(false)
  const nativeToken = useNativeCurrency()
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    setStakeAmount('')
    setPercent(0)
  }, [useBNB])

  const isWBNB = nativeToken.wrapped.equals(positionStakingToken)

  const enableNative = useNative && useBNB

  const stakingToken = useMemo(
    () => (enableNative ? nativeToken : positionStakingToken),
    [enableNative, nativeToken, positionStakingToken],
  )

  const claimedPeriods = useMemo(
    () => stakedPositions.filter((sP) => dayjs.unix(sP.endLockTime).diff(dayjs()) <= 0).map((sP) => sP.pool.lockPeriod),
    [stakedPositions],
  )

  const [lockPeriod, setLockPeriod] = useState(
    initialLockPeriod === null || initialLockPeriod === undefined
      ? first(pools.filter((p) => !claimedPeriods.includes(p.lockPeriod)))?.lockPeriod || 0
      : initialLockPeriod,
  )

  const selectedStakedPosition = useMemo(
    () => stakedPositions?.find((sP) => sP.pool.lockPeriod === lockPeriod),
    [lockPeriod, stakedPositions],
  )

  const depositedAmount = useMemo(() => {
    return CurrencyAmount.fromRawAmount(
      stakingToken,
      selectedStakedPosition ? selectedStakedPosition.userInfo.userDeposit.toString() : '0',
    )
  }, [selectedStakedPosition, stakingToken])

  const selectedPool = useMemo(() => pools.find((p) => p.lockPeriod === lockPeriod), [lockPeriod, pools])

  const isBoost = useIsBoost({
    minBoostAmount: selectedPool?.minBoostAmount,
    boostDayPercent: selectedPool?.boostDayPercent,
  })

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: positionStakingTokenBalance } = useTokenBalance(positionStakingToken?.wrapped?.address)

  const stakingTokenBalance = useMemo(
    () => (enableNative ? new BigNumber(bnbBalance?.toString()) : positionStakingTokenBalance),
    [bnbBalance, enableNative, positionStakingTokenBalance],
  )

  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const fixedStakingContract = useFixedStakingContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()

  const formattedUsdValueStaked = useStablecoinPriceAmount(stakingToken, toNumber(stakeAmount))

  const rawAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)

  const stakeCurrencyAmount = CurrencyAmount.fromRawAmount(stakingToken, rawAmount.gt(0) ? rawAmount.toString() : '0')
  const positionStakeCurrencyAmount = CurrencyAmount.fromRawAmount(
    positionStakingToken,
    rawAmount.gt(0) ? rawAmount.toString() : '0',
  )

  const totalPoolDeposited = CurrencyAmount.fromRawAmount(
    stakingToken,
    selectedPool ? selectedPool.totalDeposited.toString() : '0',
  )

  const maxStakeAmount = CurrencyAmount.fromRawAmount(stakingToken, selectedPool ? selectedPool.maxDeposit : '0')
  const minStakeAmount = CurrencyAmount.fromRawAmount(stakingToken, selectedPool ? selectedPool.minDeposit : '0')
  const maxStakePoolAmount = CurrencyAmount.fromRawAmount(stakingToken, selectedPool ? selectedPool.maxPoolAmount : '0')

  let error = ''

  const totalStakedAmount = stakeCurrencyAmount.add(depositedAmount)

  if (stakeCurrencyAmount.greaterThan(stakingTokenBalance.toString())) {
    error = t('Insufficient %symbol% balance', { symbol: stakingToken.symbol })
  } else if (totalStakedAmount.greaterThan(maxStakeAmount)) {
    error = t('Maximum %amount% %symbol%', {
      amount: maxStakeAmount.toSignificant(2),
      symbol: stakingToken.symbol,
    })
  } else if (stakeCurrencyAmount.lessThan(minStakeAmount)) {
    error = t('Minimum %amount% %symbol%', {
      amount: minStakeAmount.toSignificant(2),
      symbol: stakingToken.symbol,
    })
  } else if (stakeCurrencyAmount.add(totalPoolDeposited).greaterThan(maxStakePoolAmount)) {
    error = t('Maximum pool %amount% %symbol%', {
      amount: maxStakePoolAmount.toSignificant(2),
      symbol: stakingToken.symbol,
    })
  }

  const { approvalState, approveCallback } = useApproveCallback(stakeCurrencyAmount, fixedStakingContract?.address)

  const handleSubmission = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [selectedPool?.poolIndex, rawAmount.toString()]

      return callWithGasPrice(fixedStakingContract, 'deposit', methodArgs, {
        value: enableNative ? BigInt(rawAmount.toString()) : 0n,
      })
    })

    if (receipt?.status) {
      toastSuccess(
        t('Staked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the pool')}
        </ToastDescriptionWithTx>,
      )
      setIsConfirmed(true)
    }
  }, [
    callWithGasPrice,
    enableNative,
    fetchWithCatchTxError,
    fixedStakingContract,
    rawAmount,
    selectedPool?.poolIndex,
    t,
    toastSuccess,
  ])

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

  const isStaked = !!stakedPeriods.find((p) => p === lockPeriod)

  const aprParams = useMemo(
    () => ({
      boostDayPercent: selectedPool?.boostDayPercent || 0,
      lockDayPercent: selectedPool?.lockDayPercent || 0,
      unlockDayPercent: selectedPool?.unlockDayPercent || 0,
    }),
    [selectedPool?.boostDayPercent, selectedPool?.lockDayPercent, selectedPool?.unlockDayPercent],
  )

  const { boostAPR, lockAPR, unlockAPR } = useFixedStakeAPR(aprParams)

  const params = useMemo(
    () => ({
      alreadyStakedAmount: depositedAmount,
      stakeCurrencyAmount,
      positionStakeCurrencyAmount,
      setLockPeriod,
      lockPeriod,
      isStaked,
      boostAPR,
      lockAPR,
      unlockAPR,
      isBoost,
      poolEndDay: selectedPool?.endDay || 0,
      lastDayAction: selectedStakedPosition ? selectedStakedPosition.userInfo.lastDayAction : 0,
    }),
    [
      depositedAmount,
      stakeCurrencyAmount,
      positionStakeCurrencyAmount,
      lockPeriod,
      isStaked,
      boostAPR,
      lockAPR,
      unlockAPR,
      isBoost,
      selectedPool?.endDay,
      selectedStakedPosition,
    ],
  )

  const prevDepositedAmount = usePrevious(depositedAmount)

  useEffect(() => {
    // TODO: WHen user stake, we need to show Staked Amount in Confirm Modal
    // Currently, because of the delay in getting latest desposited amount
    // To show latest FE, it needs to programmatically add Staked Amount + depostied Amount when SC data has not been synced
    // and reset Staked Amount when the SC data is synced
    // To show Confirm Modal correctly
    if (prevDepositedAmount && !depositedAmount.equalTo(prevDepositedAmount)) {
      setStakeAmount('')
    }
  }, [depositedAmount, prevDepositedAmount])

  if (isConfirmed) {
    return (
      <Modal
        title={<ModalTitle token={stakingToken} tokenTitle={`${t('Stake')} ${stakingToken?.symbol}`} />}
        width={['100%', '100%', '420px']}
        maxWidth={['100%', '100%', '420px']}
      >
        <StakeConfirmModal
          isBoost={isBoost}
          stakeCurrencyAmount={depositedAmount.add(stakeCurrencyAmount)}
          poolEndDay={params.poolEndDay}
          lockAPR={lockAPR}
          boostAPR={boostAPR}
          unlockAPR={unlockAPR}
          lockPeriod={lockPeriod}
        />
      </Modal>
    )
  }

  return (
    <Modal
      title={title || <ModalTitle token={stakingToken} tokenTitle={`${t('Stake')} ${stakingToken?.symbol}`} />}
      width={['100%', '100%', '420px']}
      maxWidth={['100%', '100%', '420px']}
      onBack={onBack}
    >
      {head ? head() : null}
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

      <Box>
        <Slider
          min={0}
          max={100}
          value={percent}
          onValueChanged={handleChangePercent}
          name="stake"
          valueLabel={`${percent}%`}
          step={1}
        />
      </Box>

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

      {isWBNB ? (
        <>
          <Flex ml="auto" alignItems="center" justifyContent="space-between" width="100%">
            <PreTitle textTransform="uppercase" bold>
              {t('Stake as')} BNB
            </PreTitle>
            <Toggle
              id="receive-as-wnative"
              scale="sm"
              checked={useBNB}
              onChange={() => toggleUseBNB((prev) => !prev)}
            />
          </Flex>

          {useBNB ? (
            <Message variant="warning" my="8px">
              <MessageText>You will receive WBNB if you withdraw your staked BNB.</MessageText>
            </Message>
          ) : null}
        </>
      ) : null}

      <Divider />

      {typeof body === 'function' ? body(params) : body}

      {hideStakeButton ? null : (
        <>
          <DisclaimerCheckBox check={check} setCheck={setCheck} />
          {error ? (
            <Button
              disabled
              style={{
                minHeight: '48px',
              }}
            >
              {error}
            </Button>
          ) : !rawAmount.gt(0) || approvalState === ApprovalState.APPROVED ? (
            <Button
              disabled={!rawAmount.gt(0) || pendingTx || Boolean(error) || !check}
              style={{
                minHeight: '48px',
              }}
              onClick={handleSubmission}
            >
              {pendingTx ? t('Confirming') : t('Confirm')}
            </Button>
          ) : (
            <Button
              disabled={
                !rawAmount.gt(0) || approvalState === ApprovalState.PENDING || approvalState === ApprovalState.UNKNOWN
              }
              style={{
                minHeight: '48px',
              }}
              onClick={approveCallback}
            >
              {approvalState === ApprovalState.PENDING ? t('Enabling') : t('Enable')}
            </Button>
          )}

          {stakingTokenBalance.eq(0) ? (
            <Button
              as={Link}
              external
              style={{ width: '100%', marginTop: '8px', paddingTop: '16px', paddingBottom: '16px' }}
              href={`/swap?outputCurrency=${stakingToken.symbol}`}
              variant="secondary"
            >
              {t('Get %symbol%', { symbol: stakingToken.symbol })}
            </Button>
          ) : null}
        </>
      )}
    </Modal>
  )
}
