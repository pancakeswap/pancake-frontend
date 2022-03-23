import React from 'react'
import { HelpIcon, Box, BoxProps, Placement, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTooltip } from 'contexts/bmp/TooltipContext'

interface Props extends BoxProps {
  text: string | React.ReactNode
  placement?: Placement
  size?: string
}

const QuestionWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`
const QuestionHelper: React.FC<Props> = ({ text, size = '16px', ...props }) => {
  const { onPresent } = useTooltip(<Text>{text}</Text>)
  return (
    <Box {...props}>
      <QuestionWrapper onClick={onPresent}>
        <HelpIcon color="textSubtle" width={size} />
      </QuestionWrapper>
    </Box>
  )
}

export default QuestionHelper
