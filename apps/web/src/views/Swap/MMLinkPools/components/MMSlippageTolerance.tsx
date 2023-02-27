import { useTooltip, Text, InfoIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { memo } from 'react'

export const MMSlippageTolerance = memo(() => {
  const { t } = useTranslation()
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <Text width="266px" fontSize="16px">
      {t(
        'The Market Maker (MM) is currently executing for your trade, there is no slippage against the quote from MM.',
      )}
    </Text>,
    {
      placement: 'top-end',
      trigger: 'hover',
      tooltipOffset: [-3, 0],
    },
  )
  return (
    <>
      <Text ref={targetRef} color="textSubtle" display="flex" fontSize="14px" style={{ gap: 5 }}>
        -- <InfoIcon width="13px" />
      </Text>
      {tooltipVisible && tooltip}
    </>
  )
})
