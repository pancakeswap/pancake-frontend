import { Flex, Skeleton, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { FC } from 'react'

export const PerformanceFee: FC<{ performanceFee?: number }> = ({ performanceFee, children }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  return (
    <Flex mb="2px" justifyContent="space-between" alignItems="center">
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        {t('Performance Fee')}
      </TooltipText>
      <Flex alignItems="center">
        {children ||
          (performanceFee ? (
            <Text ml="4px" small>
              {performanceFee / 100}%
            </Text>
          ) : (
            <Skeleton width="90px" height="21px" />
          ))}
      </Flex>
    </Flex>
  )
}
