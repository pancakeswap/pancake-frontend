import React from 'react'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Balance from 'components/Balance'

interface AprProps {
  tokenName?: string
  isFinished: boolean
  isOldSyrup: boolean
  apy: number
}

const AprRow: React.FC<AprProps> = ({ isFinished, isOldSyrup, apy }) => {
  const TranslateString = useI18n()
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="16px">{TranslateString(736, 'APR')}:</Text>
      {isFinished || isOldSyrup || !apy ? (
        '0%'
      ) : (
        <Flex>
          <Balance fontSize="16px" bold={false} isDisabled={isFinished} value={apy} decimals={2} unit="%" />
        </Flex>
      )}
    </Flex>
  )
}

export default AprRow
