import { SubMenuItems } from '@pancakeswap/uikit'
import styled from 'styled-components'

const BaseSubMenu = styled(SubMenuItems)`
  background-color: transparent;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;

  > div {
    background-color: transparent;
  }
`

export default BaseSubMenu
