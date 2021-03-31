import React from 'react'
import { Flex, Text, Button, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useGetApiPrice } from 'state/hooks'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import CollectModal from './CollectModal'

interface EarnedProps {
  isFinished: boolean
  sousId: number
  earningTokenName: string
  stakingTokenName: string
  harvest: boolean
  isOldSyrup: boolean
  earnings: BigNumber
  isBnbPool: boolean
  earningTokenDecimals: number
}

const Earned: React.FC<EarnedProps> = ({
  isFinished,
  sousId,
  earningTokenName,
  stakingTokenName,
  isOldSyrup,
  harvest,
  earnings,
  isBnbPool,
  earningTokenDecimals,
}) => {
  const TranslateString = useI18n()
  const tokenPrice = useGetApiPrice(earningTokenName.toLowerCase())
  const earningsBusd = new BigNumber(getBalanceNumber(earnings, earningTokenDecimals))
    .multipliedBy(tokenPrice)
    .toNumber()

  const [onPresentCollect, onDismissCollect] = useModal(
    <CollectModal
      earnings={earnings}
      earningTokenDecimals={earningTokenDecimals}
      earningsBusd={earningsBusd}
      sousId={sousId}
      isBnbPool={isBnbPool}
      earningTokenName={earningTokenName}
      onDismiss={() => onDismissCollect()}
    />,
    false,
  )

  const [onPresentHarvest, onDismissHarvest] = useModal(
    <CollectModal
      earnings={earnings}
      earningTokenDecimals={earningTokenDecimals}
      earningsBusd={earningsBusd}
      sousId={sousId}
      isBnbPool={isBnbPool}
      earningTokenName={earningTokenName}
      onDismiss={() => onDismissHarvest()}
      harvest
    />,
    false,
  )

  const handleRenderActionButton = (): JSX.Element => {
    if (isFinished) {
      return (
        <Button onClick={onPresentHarvest} disabled={!earnings.toNumber()} minWidth="116px">
          {TranslateString(562, 'Harvest')}
        </Button>
      )
    }

    if (earningTokenName === stakingTokenName) {
      return (
        <Button onClick={onPresentCollect} minWidth="116px" disabled={!earnings.toNumber()}>
          Collect
        </Button>
      )
    }

    if (harvest && !isOldSyrup) {
      return (
        <Button onClick={onPresentHarvest} disabled={!earnings.toNumber()} minWidth="116px">
          {TranslateString(562, 'Harvest')}
        </Button>
      )
    }

    return null
  }

  return (
    <Flex flexDirection="column" mt="20px">
      <Flex mb="4px">
        <Text color="secondary" fontSize="12px" bold>
          {earningTokenName}
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
              value={getBalanceNumber(earnings, earningTokenDecimals)}
              isDisabled={!earnings.toNumber()}
              fontSize="20px"
              decimals={4}
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
