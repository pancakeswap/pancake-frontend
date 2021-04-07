import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Flex, Text, FlexProps, ArrowForwardIcon } from '@pancakeswap-libs/uikit'

interface NextRankProps extends FlexProps {
  title?: string
  footer?: string
  hideArrow?: boolean
  nextMedal?: ReactElement
  currentMedal?: ReactElement
}

const Wrapper = styled(Flex)`
  /* This is the cardHeaderBackground.default. Being used more & more in designs. Maybe we should export from uikit? */
  background: linear-gradient(111.68deg, #f2ecf2 0%, #e8f2f6 100%);
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 8px 24px;
  margin-top: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0;
  }
`

const MedalsWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
  }
`

const ArrowWrapper = styled(Flex)`
  svg {
    width: 10px;
    fill: ${({ theme }) => theme.colors.textSubtle};
  }
`

const NextRank: React.FC<NextRankProps> = ({
  title = '',
  footer,
  currentMedal,
  nextMedal,
  hideArrow = false,
  children,
  ...props
}) => {
  return (
    <Wrapper {...props}>
      <Flex flexDirection="column" mr="24px">
        <Text mb="8px" fontSize="12px" bold color="textSubtle">
          {title}
        </Text>
        {children}
        <Text mt="8px" fontSize="12px" color="textSubtle">
          {footer}
        </Text>
      </Flex>
      <Flex flexDirection="column">
        <MedalsWrapper>
          {currentMedal}
          {hideArrow ? null : (
            <ArrowWrapper>
              <ArrowForwardIcon />
            </ArrowWrapper>
          )}
          {nextMedal}
        </MedalsWrapper>
      </Flex>
    </Wrapper>
  )
}

export default NextRank
