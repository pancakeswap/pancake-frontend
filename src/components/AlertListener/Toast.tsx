import React, { forwardRef, useCallback, useEffect } from 'react'
import { Alert as UIKitAlert, alertVariants } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { Alert, AlertType } from 'state/types'
import { useAlert } from 'state/hooks'

interface ToastProps {
  alert: Alert
  zIndex: number
  top: number
}

const TTL = 10000
const variants = {
  [AlertType.SUCCESS]: alertVariants.SUCCESS,
  [AlertType.WARNING]: alertVariants.WARNING,
  [AlertType.DANGER]: alertVariants.DANGER,
  [AlertType.INFO]: alertVariants.INFO,
}

const StyledToast = styled.div<{ zIndex: number; top: number }>`
  position: fixed;
  min-height: 48px;
  right: 16px;
  top: ${({ top }) => `${top}px`};
  transition: all 250ms ease-in;
  width: 304px;
  z-index: ${({ zIndex }) => zIndex};

  &.alert-enter {
    opacity: 0;
  }

  &.alert-enter-active {
    opacity 0.5;
    transition: opacity 350ms ease;
  }

  &.alert-exit {
    opacity: 1;
  }

  &.alert-exit-active {
    opacity 0.5;
    transition: opacity 350ms ease;
  }

  ${({ theme }) => theme.mediaQueries.sm} => {
    width: 400px;
  }
`

const Toast = forwardRef<HTMLDivElement, ToastProps>(({ alert, ...props }, ref) => {
  const { id, type, title, description } = alert
  const { remove } = useAlert()

  const handleClick = useCallback(() => remove(id), [remove, id])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClick()
    }, TTL)

    return () => {
      clearTimeout(timer)
    }
  }, [handleClick])

  return (
    <StyledToast ref={ref} {...props}>
      <UIKitAlert variant={variants[type]} title={title} description={description} onClick={handleClick} />
    </StyledToast>
  )
})

export default Toast
