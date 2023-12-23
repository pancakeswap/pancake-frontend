import { Flex } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { styled } from 'styled-components'

export const StyledAppBody = styled(AppBody)`
  max-width: 375px;
`

export const Wrapper = styled(Flex)`
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  padding: 0px 1rem 1rem 1rem;
`
export const DropdownWrapper = styled.div<{ isClicked: boolean }>`
  opacity: ${({ isClicked }) => (isClicked ? '0' : '1')};
  width: 100%;
  transition: opacity 0.25s ease-in-out;
`
