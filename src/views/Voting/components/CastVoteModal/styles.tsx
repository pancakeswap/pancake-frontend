import { Box, BoxProps } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const VotingBox = styled.div`
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 12px;
  display: flex;
  height: 64px;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 16px;
`

export const ModalInner: React.FC<BoxProps> = (props) => {
  return <Box mb="24px" maxWidth="320px" {...props} />
}
