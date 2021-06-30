import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, ExpandableLabel, CardFooter } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import RewardMatchesContainer from './RewardMatchesContainer'

const NextDrawWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
`

const LotteryHistoryCardFooter: React.FC<{ lotteryData: LotteryRound }> = ({ lotteryData }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()

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
