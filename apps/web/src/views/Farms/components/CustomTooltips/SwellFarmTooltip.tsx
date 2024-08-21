import { useTranslation } from '@pancakeswap/localization'
import { Box, InfoFilledIcon, LinkExternal, Text, useTooltip } from '@pancakeswap/uikit'
import styled from 'styled-components'

const InlineLink = styled(LinkExternal)`
  display: inline-flex;
  margin-left: 4px;
`

export const SwellFarmTooltip = () => {
  const { t } = useTranslation()

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <Box>
      <Text display="inline" color="currentColor">
        {t('Users who deposit liquidity into this pool will earn Pills by')}
        <InlineLink m="0 4px 0 0" external display="inline" href="https://usual.money/">
          {t('Usual')}
        </InlineLink>
        {t('retroactively.')}
        <InlineLink
          m="0 4px 0 0"
          external
          display="inline"
          href="https://docs.usual.money/pre-launch-rules/pills-campaign-rules"
        >
          {t('Learn more')}
        </InlineLink>
      </Text>
    </Box>,
    {
      placement: 'top-start',
      tooltipOffset: [-20, 10],
    },
  )

  return (
    <>
      <Box ref={targetRef} width="20px" height="20px">
        <InfoFilledIcon color="#6532CD" width="20px" height="20px" />
      </Box>
      {tooltipVisible ? tooltip : null}
    </>
  )
}
