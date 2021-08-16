import React, { useState } from 'react'
import { Flex, ExpandableLabel, CardFooter } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import FooterExpanded from './FooterExpanded'

interface PreviousRoundCardFooterProps {
  lotteryNodeData: LotteryRound
  lotteryId: string
}

const PreviousRoundCardFooter: React.FC<PreviousRoundCardFooterProps> = ({ lotteryNodeData, lotteryId }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <CardFooter p="0">
      {isExpanded && <FooterExpanded lotteryNodeData={lotteryNodeData} lotteryId={lotteryId} />}
      <Flex p="8px 24px" alignItems="center" justifyContent="center">
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </Flex>
    </CardFooter>
  )
}

export default PreviousRoundCardFooter
