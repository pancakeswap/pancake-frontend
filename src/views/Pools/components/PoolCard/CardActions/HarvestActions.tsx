import React from 'react'
import { Flex, Text, Button, Heading, useModal, Skeleton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import { useGetApiPrice } from 'state/hooks'
import Balance from 'components/Balance'
import CollectModal from '../Modals/CollectModal'

interface HarvestActionsProps {
  earnings: BigNumber
  earningToken: Token
  sousId: number
  isBnbPool: boolean
  isLoading?: boolean
}

const InlineBalance = styled(Balance)`
  display: inline;
`

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  isBnbPool,
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const earningTokenPrice = useGetApiPrice(earningToken.address ? getAddress(earningToken.address) : '')
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const earningsDollarValue = formatNumber(earningTokenDollarBalance)
  const hasEarnings = earnings.toNumber() > 0
  const isCompoundPool = sousId === 0

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningsDollarValue}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  return (
    <Flex flexDirection="column" mb="16px">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          {isLoading ? (
            <Skeleton width="80px" height="48px" />
          ) : (
            <>
              {hasEarnings ? (
                <Balance bold fontSize="20px" decimals={5} value={earningTokenBalance} />
              ) : (
                <Heading color="textDisabled">0</Heading>
              )}
              <Text fontSize="12px" color={hasEarnings ? 'textSubtle' : 'textDisabled'}>
                ~
                {hasEarnings ? (
                  <InlineBalance
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                ) : (
                  '0 USD'
                )}
              </Text>
            </>
          )}
        </Flex>
        <Flex>
          <Button disabled={!hasEarnings} onClick={onPresentCollect}>
            {isCompoundPool ? t('Collect') : t('Harvest')}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default HarvestActions
