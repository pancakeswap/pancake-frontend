import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import {ChainId} from "@pancakeswap/sdk"
import { Flex, Skeleton, Text, Balance } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import {useMemo} from "react";
import useBUSDPrice from "../../../hooks/useBUSDPrice";
import {CADINU} from '@pancakeswap/tokens'


interface RewardBracketDetailProps {
  cadinuAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
  isLoading?: boolean
}

const RewardBracketDetail: React.FC<React.PropsWithChildren<RewardBracketDetailProps>> = ({
  rewardBracket,
  cadinuAmount,
  numberWinners,
  isHistoricRound,
  isBurn,
  isLoading,
}) => {
  const { t } = useTranslation()
  const price = useBUSDPrice(CADINU[ChainId.BSC])
  const cadinuPriceBusd = useMemo(() => (price ? new BigNumber(price.toSignificant(6)) : BIG_ZERO), [price])

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
        {isLoading || cadinuAmount.isNaN() ? (
          <Skeleton my="4px" mr="10px" height={20} width={110} />
        ) : (
          <Balance fontSize="20px" bold unit=" CADINU" value={getBalanceNumber(cadinuAmount)} decimals={0} />
        )}
        {isLoading || cadinuAmount.isNaN() ? (
          <>
            <Skeleton mt="4px" mb="16px" height={12} width={70} />
          </>
        ) : (
          <Balance
            fontSize="12px"
            color="textSubtle"
            prefix="~$"
            value={getBalanceNumber(cadinuAmount.times(cadinuPriceBusd))}
            decimals={0}
          />
        )}
        {isHistoricRound && cadinuAmount && (
          <>
            {numberWinners !== '0' && (
              <Text fontSize="12px" color="textSubtle">
                {getFullDisplayBalance(cadinuAmount.div(parseInt(numberWinners, 10)), 18, 2)} CAKE {t('each')}
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
