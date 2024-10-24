import { AutoColumn, ErrorIcon, Flex, Text } from '@pancakeswap/uikit'
import { css, styled } from 'styled-components'

export const Wrapper = styled(Flex)`
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
`

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
  padding: 2px;

  ${({ clickable }) =>
    clickable
      ? css`
          &:hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`

export const ErrorText = styled(Text)<{ severity?: 0 | 1 | 2 | 3 | 4 }>`
  color: ${({ theme, severity }) =>
    severity === 3 || severity === 4
      ? theme.colors.failure
      : severity === 2
      ? theme.colors.warning
      : severity === 1
      ? theme.colors.text
      : theme.colors.positive60};
`

export const StyledBalanceMaxMini = styled.button`
  height: 22px;
  width: 22px;
  background-color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 50%;
  padding: 0.2rem;
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.4rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
  &:focus {
    background-color: ${({ theme }) => theme.colors.dropdown};
    outline: none;
  }
`

export const TruncatedText = styled(Text).attrs({ ellipsis: true })`
  width: 220px;
`

const SwapCallbackErrorInner = styled.div`
  background-color: ${({ theme }) => `${theme.colors.failure33}`};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 3rem 1.25rem 1rem 1rem;
  margin-top: -2rem;
  color: ${({ theme }) => theme.colors.failure};
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`

const SwapCallbackErrorInnerAlertTriangle = styled.div`
  background-color: ${({ theme }) => `${theme.colors.failure33}`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
`

export function SwapCallbackError({ error }: { error: string }) {
  return (
    <SwapCallbackErrorInner>
      <SwapCallbackErrorInnerAlertTriangle>
        <ErrorIcon width="24px" />
      </SwapCallbackErrorInnerAlertTriangle>
      <p>{error}</p>
    </SwapCallbackErrorInner>
  )
}

export const SwapShowAcceptChanges = styled(AutoColumn)`
  background-color: ${({ theme }) => `${theme.colors.warning33}`};
  padding: 0.5rem;
  border-radius: 12px;
  margin-top: 8px;
`
