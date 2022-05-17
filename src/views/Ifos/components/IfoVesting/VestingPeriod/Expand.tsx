import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Box, Flex, Text, Progress, Button } from '@pancakeswap/uikit'

const expandAnimation = keyframes`
  from {
    opacity: 0;
    max-height: 0px;
  }
  to {
    opacity: 1;
    max-height: 200px;
  }
`

const collapseAnimation = keyframes`
  from {
    opacity: 1;
    max-height: 200px;
  }
  to {
    opacity: 0;
    max-height: 0px;
  }
`

const StyledExpand = styled(Box)<{ expanded: boolean }>`
  opacity: 1;
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  margin: 0 -24px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.dropdown};
`

interface ExpandProps {
  expanded: boolean
}

const Expand: React.FC<ExpandProps> = ({ expanded }) => {
  const { t } = useTranslation()

  return (
    <StyledExpand expanded={expanded}>
      <Progress primaryStep={10} secondaryStep={20} />
      <Flex mt="8px" mb="20px">
        <Flex flexDirection="column" mr="8px">
          <Text fontSize="14px">0.123</Text>
          <Text fontSize="14px" color="textSubtle">
            Received
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <Text fontSize="14px">0.123</Text>
          <Text fontSize="14px" color="textSubtle">
            Claimable
          </Text>
        </Flex>
        <Flex flexDirection="column" ml="auto">
          <Text fontSize="14px" textAlign="right">
            0.123
          </Text>
          <Text fontSize="14px" color="textSubtle">
            Remaining
          </Text>
        </Flex>
      </Flex>
      <Button width="100%">Calim HotCross</Button>
    </StyledExpand>
  )
}

export default Expand
