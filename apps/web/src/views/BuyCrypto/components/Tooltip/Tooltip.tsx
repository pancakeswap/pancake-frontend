import { Box, Flex, InfoFilledIcon, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { isMobile } from 'react-device-detect'

const BuyCryptoTooltip = ({
  tooltipHeading,
  tooltipText,
  iconSize,
  iconColor = 'textSubtle',
  opacity = 1,
}: {
  tooltipText: string
  iconSize: string
  tooltipHeading?: string
  iconColor?: string
  opacity?: number
}) => {
  const {
    tooltip: buyCryptoTooltip,
    tooltipVisible: buyCryptoTooltipVisible,
    targetRef: buyCryptoTargetRef,
  } = useTooltip(
    <Box maxWidth="150px">
      <Text as="p">{tooltipText}</Text>
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
          {tooltipHeading ? (
            <Text ml="4px" fontSize="15px" color="textSubtle" fontWeight="bold">
              {tooltipHeading}
            </Text>
          ) : null}
          <InfoFilledIcon pl="4px" pt="2px" color={iconColor} width={iconSize} opacity={opacity} />
        </Flex>
      </TooltipText>
      {buyCryptoTooltipVisible && buyCryptoTooltip}
    </>
  )
}

export default BuyCryptoTooltip
