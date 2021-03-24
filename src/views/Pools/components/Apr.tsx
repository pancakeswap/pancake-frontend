import React from 'react'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import { usePriceCakeBusd } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import AprButton from 'components/AprButton'

interface AprProps {
  tokenName: string
  isFinished: boolean
  isOldSyrup: boolean
  apy: number
}

const Apr: React.FC<AprProps> = ({ tokenName, isFinished, apy, isOldSyrup }) => {
  const TranslateString = useI18n()
  const cakePrice = usePriceCakeBusd()

  return (
    <Flex justifyContent="space-between">
      <Text>{TranslateString(736, 'APR')}:</Text>
      <Flex alignItems="center">
        {isFinished || isOldSyrup || !apy ? (
          '0%'
        ) : (
          <Balance fontSize="16px" isDisabled={isFinished} value={apy} decimals={2} unit="%" bold={false} />
        )}
        <AprButton lpLabel={tokenName} addLiquidityUrl="#" cakePrice={cakePrice} apy={new BigNumber(apy)} />
      </Flex>
    </Flex>
  )
}

export default Apr
