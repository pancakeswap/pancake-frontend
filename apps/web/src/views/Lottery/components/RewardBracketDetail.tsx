import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Text, Balance } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'

interface RewardBracketDetailProps {
  cakeAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
  isLoading?: boolean
}

const RewardBracketDetail: React.FC<React.PropsWithChildren<RewardBracketDetailProps>> = ({
  rewardBracket,
  cakeAmount,
  numberWinners,
  isHistoricRound,
  isBurn,
  isLoading,
}) => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeBusd()

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
      {isLoading ? (
        <Skeleton mb="4px" mt="8px" height={16} width={80} />
      ) : (
        <Text bold color={isBurn ? 'failure' : 'secondary'}>
          {getRewardText()}
        </Text>
      )}
      <>
        {isLoading || cakeAmount.isNaN() ? (
          <Skeleton my="4px" mr="10px" height={20} width={110} />
        ) : (
          <Balance fontSize="20px" bold unit=" CAKE" value={getBalanceNumber(cakeAmount)} decimals={0} />
        )}
        {isLoading || cakeAmount.isNaN() ? (
          <>
            <Skeleton mt="4px" mb="16px" height={12} width={70} />
          </>
        ) : (
          <Balance
            fontSize="12px"
            color="textSubtle"
            prefix="~$"
            value={getBalanceNumber(cakeAmount.times(cakePriceBusd))}
            decimals={0}
          />
        )}
        {isHistoricRound && cakeAmount && (
          <>
            {numberWinners !== '0' && (
              <Text fontSize="12px" color="textSubtle">
                {getFullDisplayBalance(cakeAmount.div(parseInt(numberWinners, 10)), 18, 2)} CAKE {t('each')}
              </Text>
            )}
            <Text fontSize="12px" color="textSubtle">
              {numberWinners} {t('Winning Tickets')}
            </Text>
          </>
        )}
      </>
    </Flex>
  )
}

export default RewardBracketDetail
