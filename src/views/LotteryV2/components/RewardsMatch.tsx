import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePriceCakeBusd } from 'state/hooks'
import Balance from 'components/Balance'
import { getBalanceNumber } from 'utils/formatBalance'

interface RewardsMatchProps {
  cakeAmount: BigNumber
  rewardBracket?: number
  isBurn?: boolean
}

const RewardsMatch: React.FC<RewardsMatchProps> = ({ rewardBracket, cakeAmount, isBurn }) => {
  const { t } = useTranslation()
  //    const cakePriceBusd = usePriceCakeBusd()
  const cakePriceBusd = new BigNumber(20)
  const prizeInBusd = cakeAmount.times(cakePriceBusd)

  const getRewardText = () => {
    const numberMatch = rewardBracket + 1
    if (isBurn) {
      return t('Burn')
    }
    if (rewardBracket === 5) {
      return t('Match all %numberMatch%', { numberMatch })
    }
    return t('Match first %numberMatch%', { numberMatch })
  }

  return (
    <Flex flexDirection="column" mr="12px" width="150px" mb="12px">
      <Text fontSize="12px" bold textTransform="uppercase" color={isBurn ? 'failure' : 'secondary'}>
        {getRewardText()}
      </Text>
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={12} width={90} />
        ) : (
          <Balance fontSize="12px" bold unit=" CAKE" value={getBalanceNumber(cakeAmount)} decimals={0} />
        )}
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={12} width={70} />
        ) : (
          <Balance fontSize="12px" color="textSubtle" prefix="~$" value={getBalanceNumber(prizeInBusd)} decimals={0} />
        )}
      </>
    </Flex>
  )
}

export default RewardsMatch
