import { useTranslation } from '@pancakeswap/localization'
import { BalanceInput, Button, Flex, Text, Toggle } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { useCakeVaultUserData, usePoolsPageFetch } from 'state/pools/hooks'
import styled from 'styled-components'
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
  stakingTokenBalance: BigNumber
  earningTokenPrice: number
  lpTotalSupply: BigNumber
  initialState?: any
  stakingTokenSymbol?: string
}

const BCakeCalculator: React.FC<React.PropsWithChildren<BCakeCalculatorProps>> = ({
  stakingTokenBalance,
  earningTokenPrice,
  initialState,
  stakingTokenSymbol = 'CAKE',
  lpTotalSupply,
}) => {
  useCakeVaultUserData()
  usePoolsPageFetch()
  // usePoolsWithVault()
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
  // console.log(
  //   { totalCakeInVault: getBalanceNumber(totalCakeInVault), totalLockedAmount: getBalanceNumber(totalLockedAmount) },
  //   '777',
  // )
  const { editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data

  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  // console.log({ editingUnit, editingValue, conversionUnit, conversionValue, onUserInput, principalAsToken })

  const { account } = useWeb3React()

  return (
    <>
      <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
        {t('YIELD BOOSTER')}
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
              <>
                {bCakeMultiplierFE(
                  new BigNumber(stakingTokenBalance), // userBalanceInFarm,
                  new BigNumber(principalAsToken), // userLockAmount
                  new BigNumber(secondsToWeeks(duration)).times(7), // userLockDuration
                  new BigNumber(getBalanceNumber(totalLockedAmount)), // totalLockAmount
                  new BigNumber(getBalanceNumber(lpTotalSupply)), // lpBalanceOfFarm
                  new BigNumber(avgLockDurationsInSeconds ? secondsToWeeks(avgLockDurationsInSeconds) : 40).times(7), // AverageLockDuration
                ).toFixed(3)}
                X
              </>
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

const bCakeMultiplierFE = (
  userBalanceInFarm: BigNumber,
  userLockAmount: BigNumber,
  userLockDuration: BigNumber,
  totalLockAmount: BigNumber,
  lpBalanceOfFarm: BigNumber,
  AverageLockDuration: BigNumber,
) => {
  // console.log({
  //   userBalanceInFarm: userBalanceInFarm.toString(),
  //   userLockAmount: userLockAmount.toString(),
  //   userLockDuration: userLockDuration.toString(),
  //   totalLockAmount: totalLockAmount.toString(),
  //   lpBalanceOfFarm: lpBalanceOfFarm.toString(),
  //   AverageLockDuration: AverageLockDuration.toString(),
  // })
  const CA = new BigNumber(0.5)
  const CB = new BigNumber(5)
  const dB = userBalanceInFarm.times(CA)
  const aBPart1 = lpBalanceOfFarm.times(userLockAmount).times(userLockDuration)
  const aBPart3 = totalLockAmount.times(AverageLockDuration)
  const aB = aBPart1.dividedBy(CB).dividedBy(aBPart3)
  const bigNumberResult = BigNumber.sum(dB, aB).gt(userBalanceInFarm)
    ? userBalanceInFarm.dividedBy(dB)
    : BigNumber.sum(dB, aB).dividedBy(dB)
  return bigNumberResult
}
