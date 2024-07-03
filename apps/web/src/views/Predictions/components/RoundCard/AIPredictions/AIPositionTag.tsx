import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { Flex, FlexProps, InfoIcon, SwapVertIcon, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import { styled } from 'styled-components'

interface TagProps extends FlexProps {
  endIcon?: ReactNode
}

const StyledTag = styled(Flex)`
  display: inline-flex;
`

export const Tag: React.FC<React.PropsWithChildren<TagProps>> = ({
  bg = 'success',
  endIcon,
  children,
  onClick,
  ...props
}) => {
  return (
    <StyledTag
      alignItems="center"
      justifyContent="center"
      borderRadius="8px"
      bg={bg}
      py="4px"
      px="8px"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'normal' }}
      {...props}
    >
      <Text color="white" mr="4px">
        {children}
      </Text>
      {endIcon}
    </StyledTag>
  )
}

interface AIPositionTagProps extends FlexProps {
  betPosition: BetPosition
  showIcon?: boolean
}

export const AIPositionTag: React.FC<React.PropsWithChildren<AIPositionTagProps>> = ({
  betPosition,
  showIcon = false,
  children,
  ...props
}) => {
  const { t } = useTranslation()
  // const isUpPosition = betPosition === BetPosition.BULL

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        {t('Neither side wins this round')}
      </Text>
      <Text>
        {t(
          'The Locked Price & Closed Price are exactly the same (within 8 decimals), so neither side wins. All funds entered into FOLLOW and AGAINST positions will go to the weekly CAKE burn.',
        )}
      </Text>
    </>,
    { placement: 'top' },
  )

  if (betPosition === BetPosition.HOUSE) {
    return (
      <>
        {tooltipVisible && tooltip}
        <TooltipText ref={targetRef} color="secondary" fontWeight="300" textTransform="uppercase">
          <Flex alignItems="center">
            {t('To Burn')}
            <InfoIcon width="16px" ml="4px" color="secondary" />
          </Flex>
        </TooltipText>
      </>
    )
  }

  return (
    <Tag bg="secondary" endIcon={showIcon && <SwapVertIcon color="white" transform="rotate(90)" />} {...props}>
      {children}
    </Tag>
  )
}
