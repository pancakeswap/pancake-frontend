import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, ExpandableLabel, CardFooter, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryResponse, LotteryRound } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import RewardMatchesContainer from './RewardMatchesContainer'

const NextDrawWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const LotteryHistoryCardFooter: React.FC<{ lotteryData: LotteryRound }> = ({ lotteryData }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()
  const { amountCollectedInCake } = lotteryData
  // TODO: Re-enebale in prod
  //   const cakePriceBusd = usePriceCakeBusd()
  const cakePriceBusd = new BigNumber(20)
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)

  //   const getBalances = () => {
  //     return (
  //       <>
  //         {prizeInBusd.isNaN() ? (
  //           <Skeleton my="7px" height={40} width={160} />
  //         ) : (
  //           <Balance
  //             fontSize="40px"
  //             color="secondary"
  //             lineHeight="1"
  //             bold
  //             prefix="~$"
  //             value={getBalanceNumber(prizeInBusd)}
  //             decimals={0}
  //           />
  //         )}
  //         {prizeInBusd.isNaN() ? (
  //           <Skeleton my="2px" height={14} width={90} />
  //         ) : (
  //           <Balance
  //             fontSize="14px"
  //             color="textSubtle"
  //             unit=" CAKE"
  //             value={getBalanceNumber(amountCollectedInCake.toString())}
  //             decimals={0}
  //           />
  //         )}
  //       </>
  //     )
  //   }

  return (
    <CardFooter p="0">
      {isExpanded && (
        <NextDrawWrapper>
          <RewardMatchesContainer lotteryData={lotteryData} />
        </NextDrawWrapper>
      )}
      <Flex p="8px 24px" alignItems="center" justifyContent="center">
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </Flex>
    </CardFooter>
  )
}

export default LotteryHistoryCardFooter
