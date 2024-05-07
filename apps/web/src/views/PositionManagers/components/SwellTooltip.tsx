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
        {t('Users who deposit funds into this vault will earn Pearls by Swell. To track your Pearls balance, visit')}
        <InlineLink external display="inline" href="https://app.swellnetwork.io/portfolio">
          {t("Swell's website")}
        </InlineLink>

        <br />
        <br />

        {t('Please note that the Pearls earned from this vault will only appear in your balance at a later time.')}
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
