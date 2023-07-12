import styled from 'styled-components'
import { Modal } from '@pancakeswap/uikit'

export const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 350px;
  }
`
