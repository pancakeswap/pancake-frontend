import React from 'react'
import { Flex, Text, Button, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useGetApiPrice } from 'state/hooks'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import Decimals from 'components/Decimals'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'
import CollectModal from './CollectModal'

interface EarnedProps {
  isFinished: boolean
  sousId: number
  stakingTokenName: string
  harvest: boolean
  isOldSyrup: boolean
  earnings: BigNumber
  isBnbPool: boolean
  earningToken: Token
}

const Earned: React.FC<EarnedProps> = ({
  isFinished,
  sousId,
  stakingTokenName,
  isOldSyrup,
  harvest,
  earnings,
  isBnbPool,
  earningToken,
}) => {
  const TranslateString = useI18n()
  const tokenPrice = useGetApiPrice(getAddress(earningToken.address).toLowerCase())
  const earningsBusd = new BigNumber(getBalanceNumber(earnings, earningToken.decimals))
    .multipliedBy(tokenPrice)
    .toNumber()

  const [onPresentCollect, onDismissCollect] = useModal(
    <CollectModal
      earnings={earnings}
      earningTokenDecimals={earningToken.decimals}
      earningsBusd={earningsBusd}
      sousId={sousId}
      isBnbPool={isBnbPool}
      earningTokenName={earningToken.symbol}
      onDismiss={() => onDismissCollect()}
    />,
    false,
  )

  const [onPresentHarvest, onDismissHarvest] = useModal(
    <CollectModal
      earnings={earnings}
      earningTokenDecimals={earningToken.decimals}
      earningsBusd={earningsBusd}
      sousId={sousId}
      isBnbPool={isBnbPool}
      earningTokenName={earningToken.symbol}
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

    if (earningToken.symbol === stakingTokenName) {
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
          {earningToken.symbol}
        </Text>
        &nbsp;
        <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
          {TranslateString(1072, 'Earned')}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <Flex>
            <Decimals value="15.2222" decimalPlaces={3} fontSize="20px" bold />
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
