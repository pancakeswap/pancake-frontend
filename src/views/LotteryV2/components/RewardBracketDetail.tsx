import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePriceCakeBusd } from 'state/hooks'
import Balance from 'components/Balance'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'

interface RewardBracketDetailProps {
  cakeAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
}

const RewardBracketDetail: React.FC<RewardBracketDetailProps> = ({
  rewardBracket,
  cakeAmount,
  numberWinners,
  isHistoricRound,
  isBurn,
}) => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeBusd()
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
    <Flex flexDirection="column">
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
        {isHistoricRound && cakeAmount && (
          <>
            {numberWinners !== '0' && (
              <Text fontSize="12px" color="textSubtle">
                {getFullDisplayBalance(cakeAmount.div(parseInt(numberWinners, 10)), 18, 2)} CAKE {t('each')}
              </Text>
            )}
            <Text fontSize="12px" color="textSubtle">
              {numberWinners} {t('Winners')}
            </Text>
          </>
        )}
      </>
    </Flex>
  )
}

export default RewardBracketDetail
