import { Box, BoxProps } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const VotingBoxBorder = styled(Box)<{ hasBoosted?: boolean }>`
  border-radius: 12px;
  margin-bottom: 24px;
  padding: 1px 1px 3px 1px;
  border: ${({ hasBoosted }) => (hasBoosted ? '0px' : '1px')};
  border-style: solid;
  border-color: ${({ theme, hasBoosted }) => (hasBoosted ? 'transparent' : theme.colors.cardBorder)};
  background: ${({ hasBoosted }) => (hasBoosted ? 'linear-gradient(180deg, #53dee9, #7645d9)' : 'transparent')};
`

export const VotingBoxCardInner = styled(Box)<{ hasBoosted?: boolean }>`
  height: 64px;
  display: flex;
  padding: 0 16px;
  align-items: center;
  border-radius: 12px;
  justify-content: space-between;
  background: ${({ theme, hasBoosted }) => (hasBoosted ? theme.colors.gradients.bubblegum : 'transparent')};
`

export const ModalInner: React.FC<BoxProps> = (props) => {
  return <Box mb="24px" maxWidth={['100%', '100%', '100%', '320px']} {...props} />
}
