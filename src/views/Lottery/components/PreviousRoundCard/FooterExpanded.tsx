import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Heading, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useGetLotteryGraphDataById } from 'state/lottery/hooks'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import RewardBrackets from '../RewardBrackets'

const NextDrawWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const PreviousRoundCardFooter: React.FC<{ lotteryData: LotteryRound; lotteryId: string }> = ({
  lotteryData,
  lotteryId,
}) => {
  const { t } = useTranslation()
  const lotteryGraphData = useGetLotteryGraphDataById(lotteryId)
  const cakePriceBusd = usePriceCakeBusd()

  let prizeInBusd = new BigNumber(NaN)
  if (lotteryData) {
    const { amountCollectedInCake } = lotteryData
    prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  }

  const getPrizeBalances = () => {
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="7px" height={40} width={200} />
        ) : (
          <Heading scale="xl" lineHeight="1" color="secondary">
            ~${formatNumber(getBalanceNumber(prizeInBusd), 0, 0)}
          </Heading>
        )}
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={14} width={90} />
        ) : (
          <Balance
            fontSize="14px"
            color="textSubtle"
            unit=" CAKE"
            value={getBalanceNumber(lotteryData?.amountCollectedInCake)}
            decimals={0}
          />
        )}
      </>
    )
  }

  return (
    <NextDrawWrapper>
      <Flex mr="24px" flexDirection="column" justifyContent="space-between">
        <Box>
          <Heading>{t('Prize pot')}</Heading>
          {getPrizeBalances()}
        </Box>
        <Box mb="24px">
          <Flex>
            <Text fontSize="14px" display="inline">
              {t('Total players this round')}:{' '}
              {lotteryData && lotteryGraphData.totalUsers ? (
                lotteryGraphData.totalUsers.toLocaleString()
              ) : (
                <Skeleton height={14} width={31} />
              )}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <RewardBrackets lotteryData={lotteryData} isHistoricRound />
    </NextDrawWrapper>
  )
}

export default PreviousRoundCardFooter
