import { useTranslation } from '@pancakeswap/localization'
import { Box, InfoFilledIcon, LinkExternal, Text, useTooltip } from '@pancakeswap/uikit'
import styled from 'styled-components'

const InlineLink = styled(LinkExternal)`
  display: inline-flex;
  margin-left: 4px;
`

export const TaikoEthTooltips = () => {
  const { t } = useTranslation()

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <Box>
      <Text display="inline" color="currentColor">
        {t('Users are encouraged to try out')}
        <InlineLink m="0 4px 0 0" external display="inline" href="https://bridge.taiko.xyz/">
          {t('Taiko')}
        </InlineLink>
        {t('ahead of any potential PancakeSwap Affiliate deployment')}
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
