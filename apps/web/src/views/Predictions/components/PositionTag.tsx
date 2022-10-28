import { ReactNode } from 'react'
import styled from 'styled-components'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Flex,
  FlexProps,
  Text,
  useTooltip,
  TooltipText,
  InfoIcon,
} from '@pancakeswap/uikit'
import { BetPosition } from 'state/types'
import { useTranslation } from '@pancakeswap/localization'

interface TagProps extends FlexProps {
  startIcon?: ReactNode
}

const StyledTag = styled(Flex)`
  display: inline-flex;
`

export const Tag: React.FC<React.PropsWithChildren<TagProps>> = ({
  bg = 'success',
  startIcon,
  children,
  onClick,
  ...props
}) => {
  const icon = startIcon || <ArrowUpIcon color="white" />

  return (
    <StyledTag
      alignItems="center"
      justifyContent="center"
      borderRadius="4px"
      bg={bg}
      py="4px"
      px="8px"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'normal' }}
      {...props}
    >
      {icon}
      <Text textTransform="uppercase" color="white" ml="4px">
        {children}
      </Text>
    </StyledTag>
  )
}

interface PositionTagProps extends FlexProps {
  betPosition: BetPosition
}

const PositionTag: React.FC<React.PropsWithChildren<PositionTagProps>> = ({ betPosition, children, ...props }) => {
  const { t } = useTranslation()
  const isUpPosition = betPosition === BetPosition.BULL
  const icon = isUpPosition ? <ArrowUpIcon color="white" /> : <ArrowDownIcon color="white" />
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        {t('Neither side wins this round')}
      </Text>
      <Text>
        {t(
          'The Locked Price & Closed Price are exactly the same (within 8 decimals), so neither side wins. All funds entered into UP and DOWN positions will go to the weekly CAKE burn.',
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
    <Tag bg={isUpPosition ? 'success' : 'failure'} startIcon={icon} {...props}>
      {children}
    </Tag>
  )
}

export default PositionTag
