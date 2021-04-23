import React from 'react'
import { Flex, Text, IconButton, useModal, CalculateIcon, Skeleton } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import { getPoolApr } from 'utils/apr'
import { getAddress } from 'utils/addressHelpers'
import { useGetApiPrice } from 'state/hooks'
import Balance from 'components/Balance'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import { Pool } from 'state/types'

interface AprRowProps {
  pool: Pool
  stakingTokenPrice: number
}

const AprRow: React.FC<AprRowProps> = ({ pool, stakingTokenPrice }) => {
  const { stakingToken, earningToken, totalStaked, isFinished, tokenPerBlock } = pool

  const rewardTokenPrice = useGetApiPrice(earningToken.address ? getAddress(earningToken.address) : '')
  const apr = getPoolApr(
    stakingTokenPrice,
    rewardTokenPrice,
    getBalanceNumber(totalStaked, stakingToken.decimals),
    parseFloat(tokenPerBlock),
  )

  const TranslateString = useI18n()

  const apyModalLink =
    stakingToken.address &&
    `https://exchange.pancakeswap.finance/#/swap?outputCurrency=
 ${stakingToken.address[process.env.REACT_APP_CHAIN_ID]}
   `

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={rewardTokenPrice}
      apr={apr}
      linkLabel={`${TranslateString(999, 'Get')} ${stakingToken.symbol}`}
      linkHref={apyModalLink || 'https://exchange.pancakeswap.finance'}
      earningTokenSymbol={earningToken.symbol}
    />,
  )

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="16px">{TranslateString(736, 'APR')}:</Text>
      {isFinished || !apr ? (
        <Skeleton width="82px" height="32px" />
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
