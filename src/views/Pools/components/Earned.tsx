import React from 'react'
import { Flex, Text, Button, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
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
  const earningsBusd = new BigNumber(getBalanceNumber(earnings)).multipliedBy(cakePrice).toNumber()

  const [onPresentCollect, onDismissCollect] = useModal(
    <CollectModal
      earnings={earnings}
      stakingTokenDecimals={stakingTokenDecimals}
      earningsBusd={earningsBusd}
      sousId={sousId}
      isBnbPool={isBnbPool}
      stakingTokenName={stakingTokenName}
      onDismiss={() => onDismissCollect()}
    />,
  )

  const [onPresentHarvest, onDismissHarvest] = useModal(
    <CollectModal
      earnings={earnings}
      stakingTokenDecimals={stakingTokenDecimals}
      earningsBusd={earningsBusd}
      sousId={sousId}
      isBnbPool={isBnbPool}
      stakingTokenName={stakingTokenName}
      onDismiss={() => onDismissHarvest()}
      harvest
    />,
  )

  const handleRenderActionButton = (): JSX.Element => {
    const displayedEarnings = parseFloat(getBalanceNumber(earnings, tokenDecimals).toFixed(3))

    if (tokenName === stakingTokenName) {
      return (
        <Button onClick={onPresentCollect} minWidth="116px" disabled={!displayedEarnings}>
          Collect
        </Button>
      )
    }

    if (harvest && !isOldSyrup) {
      return (
        <Button onClick={onPresentHarvest} disabled={!displayedEarnings} minWidth="116px">
          {TranslateString(562, 'Harvest')}
        </Button>
      )
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
            <Balance
              value={earningsBusd}
              isDisabled={!earningsBusd}
              fontSize="12px"
              prefix="~"
              bold={false}
              color="textSubtle"
              unit=" USD"
            />
          </Flex>
        </Flex>
        {handleRenderActionButton()}
      </Flex>
    </Flex>
  )
}

export default Earned
