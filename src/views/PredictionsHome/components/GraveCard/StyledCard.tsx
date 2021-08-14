import styled from 'styled-components'
import { Card } from '@rug-zombie-libs/uikit'

const StyledCard = styled(Card)<{ isStaking?: boolean; isFinished?: boolean }>`
  max-width: 352px;
  margin: 0 8px 24px;
  border-radius: 32px;
  display: flex;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};
  flex-direction: column;
  align-self: baseline;
  position: relative;
  background-size: 300px 300px;
  background-position-x: 100px;
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 376px;
  box-shadow: rgb(204 246 108) 0px 0px 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 12px 46px;
  }
`

export default StyledCard
