import React from 'react'
import { Flex, Text, IconButton, useModal, CalculateIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Balance from 'components/Balance'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import { Token } from 'config/constants/types'

interface AprRowProps {
  isOldSyrup?: boolean
  isFinished: boolean
  apr: number
  rewardTokenPrice: number
  stakingToken: Token
  earningTokenSymbol: string
}

const AprRow: React.FC<AprRowProps> = ({
  isOldSyrup = false,
  rewardTokenPrice,
  isFinished,
  apr,
  stakingToken,
  earningTokenSymbol,
}) => {
  const TranslateString = useI18n()
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={rewardTokenPrice}
      apr={apr}
      linkLabel={`${TranslateString(999, 'Get')} ${stakingToken.symbol}`}
      linkHref={`https://exchange.pancakeswap.finance/#/swap?outputCurrency=${
        stakingToken.address[process.env.REACT_APP_CHAIN_ID]
      }`}
      earningTokenSymbol={earningTokenSymbol}
    />,
  )

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="16px">{TranslateString(736, 'APR')}:</Text>
      {isFinished || isOldSyrup || !apr ? (
        '0%'
      ) : (
        <Flex alignItems="center">
          <Balance fontSize="16px" isDisabled={isFinished} value={apr} decimals={2} unit="%" />
          <IconButton onClick={onPresentApyModal} variant="text" scale="sm">
            <CalculateIcon color="textSubtle" width="18px" />
          </IconButton>
        </Flex>
      )}
    </Flex>
  )
}

export default AprRow
