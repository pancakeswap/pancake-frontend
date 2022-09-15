import { useTranslation } from '@pancakeswap/localization'
import { BalanceInput, Button, Flex, Text, Toggle } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import { useCakeVaultPublicData, useCakeVaultUserData } from 'state/pools/hooks'
import styled from 'styled-components'
import { BIG_TEN } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { useUserLockedCakeStatus } from 'views/Farms/hooks/useUserLockedCakeStatus'
import useAvgLockDuration from 'views/Pools/components/LockedPool/hooks/useAvgLockDuration'
import { secondsToWeeks, weeksToSeconds } from 'views/Pools/components/utils/formatSecondsToWeeks'
import LockDurationField from './BCakeLockedDuration'
import useRoiCalculatorReducer, { CalculatorMode, EditingCurrency } from './useRoiCalculatorReducer'

const BCakeBlock = styled.div`
  background-color: #faf9fa;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 16px;
`
interface BCakeCalculatorProps {
  targetInputBalance: string
  earningTokenPrice: number
  lpTotalSupply: BigNumber
  initialState?: any
  stakingTokenSymbol?: string
  setBCakeMultiplier: (multiplier: string) => void
}

const BCakeCalculator: React.FC<React.PropsWithChildren<BCakeCalculatorProps>> = ({
  targetInputBalance,
  earningTokenPrice,
  initialState,
  stakingTokenSymbol = 'CAKE',
  lpTotalSupply,
  setBCakeMultiplier,
}) => {
  useCakeVaultUserData()
  useCakeVaultPublicData()
  const [isShow, setIsShow] = useState(true)
  const { t } = useTranslation()
  const [duration, setDuration] = useState(() => weeksToSeconds(1))
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { lockBalance, isLoading, totalLockedAmount } = useUserLockedCakeStatus()
  const { state, setPrincipalFromUSDValue, setPrincipalFromTokenValue, toggleEditingCurrency, setCalculatorMode } =
    useRoiCalculatorReducer(
      { stakingTokenPrice: earningTokenPrice, earningTokenPrice, autoCompoundFrequency: 0 },
      initialState,
    )
  const { editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data
  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }
  const bCakeMultiplier = useMemo(() => {
    const result = getBCakeMultiplier(
      new BigNumber(targetInputBalance).multipliedBy(BIG_TEN.pow(18)), // userBalanceInFarm,
      new BigNumber(principalAsToken).multipliedBy(BIG_TEN.pow(18)), // userLockAmount
      new BigNumber(secondsToWeeks(duration)).times(7), // userLockDuration
      totalLockedAmount, // totalLockAmount
      lpTotalSupply, // lpBalanceOfFarm
      // TODO: parse sec to day directly
      new BigNumber(avgLockDurationsInSeconds ? secondsToWeeks(avgLockDurationsInSeconds) : 40).times(7), // AverageLockDuration
    )
    return result.toString() === 'NaN' ? '1.000' : result.toFixed(3)
  }, [targetInputBalance, principalAsToken, duration, totalLockedAmount, lpTotalSupply, avgLockDurationsInSeconds])

  useEffect(() => {
    setBCakeMultiplier(bCakeMultiplier)
  }, [bCakeMultiplier, setBCakeMultiplier])

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  const { account } = useWeb3React()

  return (
    <>
      <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
        {t('Yield Booster')}
      </Text>
      <Toggle scale="md" checked={isShow} onClick={() => setIsShow(!isShow)} />
      {isShow && (
        <>
          <BCakeBlock>
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              {t('Cake locked')}
            </Text>
            <BalanceInput
              inputProps={{
                scale: 'sm',
              }}
              currencyValue={`${conversionValue} ${conversionUnit}`}
              // innerRef={balanceInputRef}
              placeholder="0.00"
              value={editingValue}
              unit={editingUnit}
              onUserInput={onUserInput}
              switchEditingUnits={toggleEditingCurrency}
              onFocus={onBalanceFocus}
            />
            <Flex justifyContent="space-between" mt="8px">
              <Button
                scale="xs"
                p="4px 16px"
                width="68px"
                variant="tertiary"
                onClick={() => setPrincipalFromUSDValue('100')}
              >
                $100
              </Button>
              <Button
                scale="xs"
                p="4px 16px"
                width="68px"
                variant="tertiary"
                onClick={() => setPrincipalFromUSDValue('1000')}
              >
                $1000
              </Button>
              <Button
                disabled={!account || isLoading}
                scale="xs"
                p="4px 16px"
                width="128px"
                variant="tertiary"
                style={{ textTransform: 'uppercase' }}
                onClick={() =>
                  setPrincipalFromUSDValue(
                    getBalanceNumber(lockBalance.cakeAsBigNumber.times(earningTokenPrice)).toFixed(2),
                  )
                }
              >
                {t('My Balance')}
              </Button>
            </Flex>
            <LockDurationField duration={duration} setDuration={setDuration} isOverMax={false} />
          </BCakeBlock>
          <BCakeBlock style={{ marginTop: 16 }}>
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              <>{t('Boost Multiplier')}</>
            </Text>
            <Text color="text" bold fontSize="20px" textTransform="uppercase">
              <>{bCakeMultiplier}X</>
            </Text>
            <Text color="textSubtle" fontSize={12}>
              {t(
                'The estimated boost multiplier is calculated using live data. The actual boost multiplier may change upon activation.',
              )}
            </Text>
          </BCakeBlock>
        </>
      )}
    </>
  )
}

export default BCakeCalculator

const CA = 0.5
const CB = 5

const getBCakeMultiplier = (
  userBalanceInFarm: BigNumber,
  userLockAmount: BigNumber,
  userLockDuration: BigNumber,
  totalLockAmount: BigNumber,
  lpBalanceOfFarm: BigNumber,
  averageLockDuration: BigNumber,
) => {
  // console.log({
  //   userBalanceInFarm: userBalanceInFarm.toString(),
  //   userLockAmount: userLockAmount.toString(),
  //   userLockDuration: userLockDuration.toString(),
  //   totalLockAmount: totalLockAmount.toString(),
  //   lpBalanceOfFarm: lpBalanceOfFarm.toString(),
  //   averageLockDuration: averageLockDuration.toString(),
  // })
  const dB = userBalanceInFarm.times(CA)
  const aBPart1 = lpBalanceOfFarm.times(userLockAmount).times(userLockDuration)
  const aBPart3 = totalLockAmount.times(averageLockDuration)
  const aB = aBPart1.dividedBy(CB).dividedBy(aBPart3)
  const bigNumberResult = dB.plus(aB).gt(userBalanceInFarm)
    ? userBalanceInFarm.dividedBy(dB)
    : dB.plus(aB).dividedBy(dB)
  return bigNumberResult
}
