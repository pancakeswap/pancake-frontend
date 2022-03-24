import { useState } from 'react'
import { Text, Flex, Image, BalanceInput, Slider, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { BIG_TEN } from 'utils/bigNumber'

import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const BalanceField = ({
  stakingAddress,
  stakingSymbol,
  stakingDecimals,
  stakeAmount,
  cakePriceBusd,
  stakingMax,
  setStakeAmount,
}) => {
  const { t } = useTranslation()
  const [percent, setPercent] = useState(0)

  const usdValueStaked = new BigNumber(stakeAmount).times(cakePriceBusd)
  const formattedUsdValueStaked = cakePriceBusd.gt(0) && stakeAmount ? formatNumber(usdValueStaked.toNumber()) : ''

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = new BigNumber(input).multipliedBy(BIG_TEN.pow(stakingDecimals))
      const percentage = Math.floor(convertedInput.dividedBy(stakingMax).multipliedBy(100).toNumber())
      setPercent(percentage > 100 ? 100 : percentage)
    } else {
      setPercent(0)
    }
    setStakeAmount(input)
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = stakingMax.dividedBy(100).multipliedBy(sliderPercent)
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingDecimals, stakingDecimals)
      setStakeAmount(amountToStake)
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          CAKE TO LOCK
        </Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${stakingAddress}.png`} width={24} height={24} alt={stakingSymbol} />
          <Text ml="4px" bold>
            {stakingSymbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={cakePriceBusd.gt(0) && `~${formattedUsdValueStaked || 0} USD`}
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

export default BalanceField
