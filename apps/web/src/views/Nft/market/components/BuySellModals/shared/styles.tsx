import { styled } from 'styled-components'
import { Flex, Image } from '@pancakeswap/uikit'

export const RoundedImage = styled(Image)`
  border-radius: ${({ theme }) => theme.radii.small};
  overflow: hidden;
`

export const Divider = styled.div`
  margin: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export const HorizontalDivider = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export const StepIndicator = styled(Flex)<{ success: boolean; disabled?: boolean }>`
  border-radius: 50%;
  background-color: ${({ theme, success, disabled }) => {
    if (disabled) {
      return 'none'
    }
    return success ? theme.colors.success : theme.colors.secondary
  }};
  border: ${({ theme, disabled }) => (disabled ? `1px solid ${theme.colors.textDisabled}` : 'none')};
  height: 32px;
  width: 32px;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`
