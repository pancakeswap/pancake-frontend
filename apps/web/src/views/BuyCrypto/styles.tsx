import { Box, Button, Flex, InputProps } from '@pancakeswap/uikit'
import { scales } from '@pancakeswap/uikit/components/PancakeToggle/types'
import { AppBody } from 'components/App'
import { DefaultTheme, css, styled } from 'styled-components'

interface StyledInputProps extends InputProps {
  theme: DefaultTheme
}
export const StyledAppBody = styled(AppBody)`
  max-width: 375px;
`

export const Wrapper = styled(Flex)`
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  padding: 0px 0.6rem 0.6rem 0.6rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0px 1rem 1rem 1rem;
  }
`
export const DropdownWrapper = styled.div<{ isClicked: boolean }>`
  opacity: ${({ isClicked }) => (isClicked ? '0' : '1')};
  width: 100%;
  transition: opacity 0.25s ease-in-out;
`
export const StyledNotificationWrapper = styled.div<{ show: boolean }>`
  display: flex;
  position: relative;
  overflow: hidden;
  // padding: 0px 8px;

  width: 100%;

  transition: background-color 0.6s ease, padding 0.3s ease-in-out;
`

export const Description = styled.div<{ show: boolean; elementHeight: number }>`
  overflow: hidden;
  width: 100%;
  word-break: break-word;
  transition: max-height 0.33s ease-in-out;
  max-height: ${({ show, elementHeight }) => (show ? `${elementHeight}px` : '0px')};
`
export const StyledFeesContainer = styled(Box)<{ disabled: boolean }>`
  padding: 6px 16px;
  border-radius: 16px;
  z-index: 10;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  position: relative;
  border: 1.5px dashed ${({ theme }) => (theme.isDark ? `${theme.colors.input}` : `${theme.colors.inputSecondary}`)};
  &:hover {
    cursor: pointer;
  }
  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}
`

export const StyledFeesContainer3 = styled(Flex)`
  padding: 2px 16px;
  border-radius: 16px;
  z-index: 10;
  // background: ${({ theme }) => theme.colors.backgroundAlt};
  background: ${({ theme }) => theme.colors.input};

  border: ${({ theme }) => `1.5px dashed ${theme.colors.inputSecondary}`};
  &:hover {
    cursor: pointer;
  }
`

export const FilterdNetworkWrapper = styled(Flex)<{ showPopOver: boolean }>`
  position: absolute;
  width: 100%;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  max-height: 100%;
  display: flex;
  flex-direction: column;
  height: max-content;
  z-index: 9999;
  transition: bottom 0.3s ease-in-out;
  bottom: ${({ showPopOver }) => (!showPopOver ? '-100%' : '0%')};
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  box-shadow: 6px 20px 12px 8px rgba(74, 74, 104, 0.1);
`
export const NetworkFilterOverlay = styled(Flex)<{ showPopOver: boolean }>`
  position: absolute;
  width: 100%;
  z-index: 9999;

  background-color: #e2d2ff;
  height: 100%;
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ showPopOver }) => (!showPopOver ? '0' : '0.8')};
  pointer-events: ${({ showPopOver }) => (showPopOver ? 'auto' : 'none')};
`
export const StyledIframe = styled.iframe<{ isDark: boolean }>`
  height: 650px;
  width: 100vw;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 425px;
  }

  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`

export const IFrameWrapper = styled(Flex)`
  height: 650px;
  width: 100vw;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 425px;
  }

  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`
export const StyledBackArrowContainer = styled(Box)`
  position: absolute;
  right: 10%;
  &:hover {
    cursor: pointer;
  }
`

export const ModalHeader = styled.div<{ background?: string }>`
  align-items: center;
  background: transparent;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 12px 24px;
  position: relative;

  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({ background }) => background || 'transparent'};
  }
`

export const DropDownContainer = styled.div<{ error: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  box-shadow: ${({ theme, error }) => (error ? theme.shadows.danger : theme.shadows.inset)};
  border: 1px solid ${({ theme, error }) => (error ? theme.colors.failure : theme.colors.inputSecondary)};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.input};
  cursor: pointer;
  position: relative;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }
`

export const OptionSelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0px;
  border-left: ${({ theme }) => `1px solid ${theme.colors.inputSecondary}`};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 135px;
  padding-left: 12px;
  // padding-right: 8px;
  border-radius: 0px;
`

const getBoxShadow = ({ isSuccess = false, isWarning = false, theme }: StyledInputProps) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  if (isSuccess) {
    return theme.shadows.success
  }

  return theme.shadows.inset
}

export const StyledVerticalLine = styled.div`
  position: fixed;
  height: calc(23%);
  width: 2px;
  border-left: 2px dashed ${({ theme }) => (theme.isDark ? `${theme.colors.input}` : `${theme.colors.inputSecondary}`)};

  margin-top: 10px;
  z-index: 0;
  left: calc(50% - 3px);
`
export const StyledArrowHead = styled.div`
  position: absolute;
  height: 0px;
  width: 0px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: ${({ theme }) => `6px dashed ${theme.colors.inputSecondary}`};
  bottom: 100%;
  left: calc(50% - 10px);
`
export const StyledCircle = styled.div`
  position: absolute;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.inputSecondary};
  left: calc(50% - 8px);
  top: 93%;
`
export const OnRampIconContainer = styled(Box)`
  position: relative;
  z-index: 1;
`

export const OnRampIconCircleWrapper = styled(Box)<{ border: boolean }>`
  position: absolute;
  border-radius: 50%;
  ${({ border }) =>
    border &&
    css`
      overflow: hidden;
      border: solid 3px white;
    `}
`

const InputExtended = styled('input').withConfig({
  shouldForwardProp: (props) => !['scale', 'isSuccess', 'isWarning'].includes(props),
})<InputProps & { height: string }>`
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-size: 16px;
  height: ${({ height }) => height};
  outline: 0;
  padding: 0 16px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    box-shadow: ${({ theme, isWarning, isSuccess }) => {
      if (isWarning) {
        return theme.shadows.danger
      }

      if (isSuccess) {
        return theme.shadows.success
      }
      return theme.shadows.focus
    }};
  }
`

InputExtended.defaultProps = {
  scale: scales.MD,
  isSuccess: false,
  isWarning: false,
}

export default InputExtended
