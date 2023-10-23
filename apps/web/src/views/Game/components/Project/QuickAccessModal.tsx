import { styled } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { QuickAccess } from 'views/Game/components/Project/QuickAccess'

const StyledQuickAccessModal = styled(Box)`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndices.modal};
`

export const QuickAccessModal = () => {
  return (
    <StyledQuickAccessModal>
      <QuickAccess isOpen />
    </StyledQuickAccessModal>
  )
}
