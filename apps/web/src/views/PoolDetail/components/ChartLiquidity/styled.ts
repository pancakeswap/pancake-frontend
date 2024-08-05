import styled from 'styled-components'

export const ControlsWrapper = styled.div`
  position: absolute;
  right: 40px;
  bottom: 100px;
  padding: 4px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 6px;
`
export const ActionButton = styled.div<{ disabled?: boolean }>`
  width: 32x;
  border-radius: 50%;
  background-color: black;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 0.9)};
  background-color: ${({ theme, disabled }) => (disabled ? theme.colors.backgroundAlt2 : theme.colors.backgroundAlt)};
  user-select: none;

  &:hover {
    cursor: pointer;
    opacity: 0.4;
  }
`
