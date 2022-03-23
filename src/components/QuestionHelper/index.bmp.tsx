import React from 'react'
import { HelpIcon, Box, BoxProps, Placement, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Tooltip from '../bmp/Tooltip'

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
  const [visible, setVisible] = React.useState(false)
  return (
    <Box {...props}>
      <QuestionWrapper onClick={() => setVisible(true)}>
        <HelpIcon color="textSubtle" width={size} />
      </QuestionWrapper>
      <Tooltip visible={visible} onClose={() => setVisible(false)}>
        <Text>{text}</Text>
      </Tooltip>
    </Box>
  )
}

export default QuestionHelper
