import React, { useState, useEffect } from 'react'
import { Flex, ExpandableLabel, CardFooter, Skeleton } from '@pancakeswap/uikit'
import usePreviousValue from 'hooks/usePreviousValue'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import FooterExpanded from './FooterExpanded'

interface PreviousRoundCardFooterProps {
  lotteryData: LotteryRound
  lotteryId: string
}

const PreviousRoundCardFooter: React.FC<PreviousRoundCardFooterProps> = ({ lotteryData, lotteryId }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const previousLotteryId = usePreviousValue(lotteryId)

  useEffect(() => {
    // Close when changing lottery rounds
    if (lotteryId !== previousLotteryId) {
      setIsExpanded(false)
    }
  }, [lotteryId, previousLotteryId])

  return (
    <CardFooter p="0">
      {isExpanded && lotteryData && <FooterExpanded lotteryData={lotteryData} lotteryId={lotteryId} />}
      <Flex p="8px 24px" alignItems="center" justifyContent="center">
        {lotteryData ? (
          <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? t('Hide') : t('Details')}
          </ExpandableLabel>
        ) : (
          <Skeleton height="24px" width="83px" my="12px" />
        )}
      </Flex>
    </CardFooter>
  )
}

export default PreviousRoundCardFooter
