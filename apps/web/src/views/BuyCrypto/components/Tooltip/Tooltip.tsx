import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, InfoFilledIcon, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { isMobile } from 'react-device-detect'

const BuyCryptoTooltip = ({ tooltipHeading, tooltipText }: { tooltipHeading: string; tooltipText: string }) => {
  const { t } = useTranslation()

  const {
    tooltip: buyCryptoTooltip,
    tooltipVisible: buyCryptoTooltipVisible,
    targetRef: buyCryptoTargetRef,
  } = useTooltip(
    <Box maxWidth="150px">
      <Text as="p">{t(tooltipText)}</Text>
    </Box>,
    {
      placement: isMobile ? 'top' : 'bottom',
      trigger: isMobile ? 'focus' : 'hover',
    },
  )
  return (
    <>
      <TooltipText ref={buyCryptoTargetRef}>
        <Flex alignItems="center" justifyContent="center">
          <Text ml="4px" fontSize="15px" color="textSubtle" fontWeight="bold">
            {t(tooltipHeading)}
          </Text>
          <InfoFilledIcon pl="4px" pt="2px" color="textSubtle" width="22px" />
        </Flex>
      </TooltipText>
      {buyCryptoTooltipVisible && buyCryptoTooltip}
    </>
  )
}

export default BuyCryptoTooltip
