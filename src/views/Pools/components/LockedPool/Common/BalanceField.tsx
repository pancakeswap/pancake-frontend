import { useState, useCallback, memo, Dispatch, SetStateAction } from 'react'

import { Text, Flex, Image, BalanceInput, Slider, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { BIG_TEN } from 'utils/bigNumber'

import { getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'

const StyledButton = styled(Button)`
  flex-grow: 1;
`

interface PropsType {
  stakingAddress: string
  stakingSymbol: string
  stakingDecimals: number
  lockedAmount: number
  stakingMax: BigNumber
  setLockedAmount: Dispatch<SetStateAction<number>>
  usedValueStaked: number | undefined
}

const BalanceField: React.FC<PropsType> = ({
  stakingAddress,
  stakingSymbol,
  stakingDecimals,
  lockedAmount,
  stakingMax,
  setLockedAmount,
  usedValueStaked,
}) => {
  const { t } = useTranslation()
  const [percent, setPercent] = useState(0)

  const handleStakeInputChange = useCallback(
    (input: string) => {
      if (input) {
        const convertedInput = new BigNumber(input).multipliedBy(BIG_TEN.pow(stakingDecimals))
        const percentage = Math.floor(convertedInput.dividedBy(stakingMax).multipliedBy(100).toNumber())
        setPercent(percentage > 100 ? 100 : percentage)
      } else {
        setPercent(0)
      }
      setLockedAmount(Number(input))
    },
    [stakingDecimals, stakingMax, setLockedAmount],
  )

  const handleChangePercent = useCallback(
    (sliderPercent: number) => {
      if (sliderPercent > 0) {
        const percentageOfStakingMax = stakingMax.dividedBy(100).multipliedBy(sliderPercent)
        const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingDecimals, stakingDecimals)
        setLockedAmount(Number(amountToStake))
      } else {
        setLockedAmount(0)
      }
      setPercent(sliderPercent)
    },
    [stakingMax, setLockedAmount, stakingDecimals],
  )

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('CAKE to lock')}
        </Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${stakingAddress}.png`} width={24} height={24} alt={stakingSymbol} />
          <Text ml="4px" bold>
            {stakingSymbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={lockedAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={`~${usedValueStaked || 0} USD`}
        decimals={stakingDecimals}
      />
      <Text mt="8px" textAlign="end" color="textSubtle" fontSize="12px" mb="8px">
        {t('Balance: %balance%', { balance: getFullDisplayBalance(stakingMax, stakingDecimals) })}
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
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(25)}>
          25%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(50)}>
          50%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(75)}>
          75%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(100)}>
          {t('Max')}
        </StyledButton>
      </Flex>
    </>
  )
}

export default memo(BalanceField)
