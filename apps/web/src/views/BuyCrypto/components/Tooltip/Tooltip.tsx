import { Box, Flex, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import { isMobile } from 'react-device-detect'

const BuyCryptoTooltip = ({
  tooltipBody,
  tooltipHeading,
  tooltipContent,
}: {
  tooltipBody: ReactNode
  tooltipContent: ReactNode
  tooltipHeading?: string
}) => {
  const {
    tooltip: buyCryptoTooltip,
    tooltipVisible: buyCryptoTooltipVisible,
    targetRef: buyCryptoTargetRef,
  } = useTooltip(<Box>{tooltipContent}</Box>, {
    placement: 'top',

    trigger: isMobile ? 'focus' : 'hover',
  })
  return (
    <>
      <TooltipText ref={buyCryptoTargetRef} style={{ textDecoration: 'none' }}>
        <Flex alignItems="center" justifyContent="center">
          {tooltipHeading ? (
            <Text ml="4px" fontSize="15px" color="textSubtle" fontWeight="bold">
              {tooltipHeading}
            </Text>
          ) : null}
          {tooltipBody}
        </Flex>
      </TooltipText>
      {buyCryptoTooltipVisible && buyCryptoTooltip}
    </>
  )
}

export default BuyCryptoTooltip
