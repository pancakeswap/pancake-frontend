import { useTranslation } from '@pancakeswap/localization'
import { Box, InfoFilledIcon, LinkExternal, Placement, Text, useTooltip } from '@pancakeswap/uikit'
import styled from 'styled-components'

const InlineLink = styled(LinkExternal)`
  display: inline-flex;
  margin-left: 4px;
`

function SwellTips() {
  const { t } = useTranslation()

  return (
    <Box>
      <Text display="inline" color="currentColor">
        {t('Users who deposit funds into this farm will earn Black Pearls by Swell. To track your balance, visit')}
        <InlineLink external display="inline" href="https://app.swellnetwork.io/dao/swell-city ">
          {t("Swell's website")}
        </InlineLink>
      </Text>
    </Box>
  )
}

type SwellTooltipProps = {
  // warning icon width/height px
  size?: string
  placement?: Placement
  tooltipOffset?: [number, number]
}

export function SwellTooltip({ size = '20px', placement = 'top-start', tooltipOffset = [-20, 10] }: SwellTooltipProps) {
  const { tooltip, tooltipVisible, targetRef } = useTooltip(<SwellTips />, {
    placement,
    tooltipOffset,
  })

  return (
    <>
      <Box ref={targetRef} width={size} height={size}>
        <InfoFilledIcon color="#6532CD" width={size} height={size} />
      </Box>
      {tooltipVisible ? tooltip : null}
    </>
  )
}
