import React from 'react'
import { Flex, Text, Button } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import { useSousHarvest } from 'hooks/useHarvest'
import { usePriceCakeBusd } from 'state/hooks'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'

interface EarnedProps {
  isFinished: boolean
  sousId: number
  tokenName: string
  harvest: boolean
  isOldSyrup: boolean
  earnings: BigNumber
  pendingTx: boolean
  isBnbPool: boolean
  tokenDecimals: number
  setPendingTx: (status: boolean) => void
}

const Earned: React.FC<EarnedProps> = ({
  isFinished,
  sousId,
  tokenName,
  isOldSyrup,
  harvest,
  pendingTx,
  earnings,
  isBnbPool,
  tokenDecimals,
  setPendingTx,
}) => {
  const TranslateString = useI18n()
  const cakePrice = usePriceCakeBusd()
  const { account } = useWeb3React()
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const earningsBusd = earnings.multipliedBy(cakePrice).toNumber()

  return (
    <Flex justifyContent="space-between" mt="27px">
      <Flex flexDirection="column">
        <Flex>
          <Text color="textSecondary" fontSize="12px" bold>
            {tokenName}
          </Text>
          &nbsp;
          <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
            {TranslateString(1072, 'Earned')}
          </Text>
        </Flex>
        <Flex>
          <Balance
            value={getBalanceNumber(earnings, tokenDecimals)}
            isDisabled={!earnings.toNumber() || isFinished}
            fontSize="20px"
          />
        </Flex>
        <Flex>
          <Balance value={earningsBusd} isDisabled={!earningsBusd} fontSize="12px" prefix="~" />
        </Flex>
      </Flex>
      {account && harvest && !isOldSyrup && (
        <Button
          disabled={!earnings.toNumber() || pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          {pendingTx ? 'Collecting' : 'Harvest'}
        </Button>
      )}
    </Flex>
  )
}

export default Earned
