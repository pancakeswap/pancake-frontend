import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text, IconButton, useModal, CalculateIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Balance from 'components/Balance'
import ApyCalculatorModal from 'components/ApyCalculatorModal'

interface AprRowProps {
  isOldSyrup?: boolean
  isFinished: boolean
  apr: number
  cakePrice: BigNumber
}

const AprRow: React.FC<AprRowProps> = ({ isOldSyrup = false, cakePrice, isFinished, apr }) => {
  const TranslateString = useI18n()
  const [onPresentApyModal] = useModal(<ApyCalculatorModal cakePrice={cakePrice} apr={apr} />)

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="16px">{TranslateString(736, 'APR')}:</Text>
      {isFinished || isOldSyrup || !apr ? (
        '0%'
      ) : (
        <>
          <Flex alignItems="center">
            <Balance fontSize="16px" bold={false} isDisabled={isFinished} value={apr} decimals={2} unit="%" />
            <IconButton onClick={onPresentApyModal} variant="text" scale="sm">
              <CalculateIcon color="textSubtle" width="18px" />
            </IconButton>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default AprRow
