import React from 'react'
import { IconButton, CloseIcon, HelpIcon, Box, BoxProps, Placement, Overlay, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

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
const OverlayInner = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  position: absolute;
  top: 50%;
  width: 80%;
  border-radius: 10px;
  margin: auto;
  padding: 16px;
  left: 0;
  right: 0;
`
const QuestionHelper: React.FC<Props> = ({ text, placement = 'right-end', size = '16px', ...props }) => {
  const [visible, setVisible] = React.useState(false)
  return (
    <Box {...props}>
      <QuestionWrapper onClick={() => setVisible(true)}>
        <HelpIcon color="textSubtle" width={size} />
      </QuestionWrapper>
      {visible && (
        <Overlay onClick={() => setVisible(false)}>
          <OverlayInner>
            <Text style={{ marginRight: 20 }}>{text}</Text>

            <IconButton
              variant="text"
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => setVisible(false)}
              aria-label="Close the dialog"
            >
              <CloseIcon color="text" width="24px" />
            </IconButton>
          </OverlayInner>
        </Overlay>
      )}
    </Box>
  )
}

export default QuestionHelper
