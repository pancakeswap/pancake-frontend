import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Flex, Text, FlexProps, ArrowForwardIcon } from '@pancakeswap/uikit'

interface NextRankProps extends FlexProps {
  title?: string
  footer?: string
  hideArrow?: boolean
  nextMedal?: ReactElement
  currentMedal?: ReactElement
}

const Wrapper = styled(Flex)`
  background: ${({ theme }) => theme.card.cardHeaderBackground.default};
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 8px;
  margin-top: 8px;

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 8px 24px;
  }

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
    height: 10px;
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
      <Flex flexDirection="column" mr={['8px', '24px']}>
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
