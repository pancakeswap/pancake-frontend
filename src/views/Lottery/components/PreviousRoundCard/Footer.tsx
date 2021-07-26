import React, { useState } from 'react'
import { Flex, ExpandableLabel, CardFooter } from '@pancakeswap/uikit'
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

  return (
    <CardFooter p="0">
      {isExpanded && <FooterExpanded lotteryData={lotteryData} lotteryId={lotteryId} />}
      <Flex p="8px 24px" alignItems="center" justifyContent="center">
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </Flex>
    </CardFooter>
  )
}

export default PreviousRoundCardFooter
