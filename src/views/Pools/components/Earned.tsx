import React from 'react'
import { Flex, Text, Button, useModal } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import { useSousHarvest } from 'hooks/useHarvest'
import { usePriceCakeBusd } from 'state/hooks'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import CollectModal from './CollectModal'

interface EarnedProps {
  isFinished: boolean
  sousId: number
  tokenName: string
  stakingTokenName: string
  harvest: boolean
  isOldSyrup: boolean
  earnings: BigNumber
  isBnbPool: boolean
  tokenDecimals: number
  stakingTokenDecimals?: number
}

const Earned: React.FC<EarnedProps> = ({
  isFinished,
  sousId,
  tokenName,
  stakingTokenName,
  isOldSyrup,
  harvest,
  earnings,
  isBnbPool,
  tokenDecimals,
  stakingTokenDecimals,
}) => {
  const TranslateString = useI18n()
  const cakePrice = usePriceCakeBusd()
  const { account } = useWeb3React()
  const earningsBusd = earnings.multipliedBy(cakePrice).toNumber()

  const [onPresentCollect] = useModal(
    <CollectModal
      earnings={earnings}
      stakingTokenDecimals={stakingTokenDecimals}
      earningsBusd={earningsBusd}
      sousId={sousId}
      isBnbPool={isBnbPool}
    />,
  )

  const [onPresentHarvest] = useModal(
    <CollectModal
      earnings={earnings}
      stakingTokenDecimals={stakingTokenDecimals}
      earningsBusd={earningsBusd}
      sousId={sousId}
      isBnbPool={isBnbPool}
      harvest
    />,
  )

  const handleRenderActionButton = (): JSX.Element => {
    if (tokenName === stakingTokenName) {
      return <Button onClick={onPresentCollect}>Collect</Button>
    }

    if (account && harvest && !isOldSyrup) {
      return <Button onClick={onPresentHarvest}>{TranslateString(562, 'Harvest')}</Button>
    }

    return null
  }

  return (
    <Flex flexDirection="column" mt="20px">
      <Flex mb="4px">
        <Text color="textSecondary" fontSize="12px" bold>
          {tokenName}
        </Text>
        &nbsp;
        <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
          {TranslateString(1072, 'Earned')}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
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
<<<<<<< HEAD
        {handleRenderActionButton()}
=======
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
>>>>>>> feat: Pool card layout updated
      </Flex>
    </Flex>
  )
}

export default Earned
