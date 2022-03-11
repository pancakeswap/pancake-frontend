import React, { useCallback, useEffect, useRef } from 'react'
import { CSSTransition, Transition } from 'react-transition-group'
import styled from 'styled-components'
import { Alert, alertVariants } from '@pancakeswap/uikit'
import { ToastProps, types } from './types'
import Transaction from 'components/App/Transactions/Transaction'

const alertTypeMap = {
  [types.INFO]: alertVariants.INFO,
  [types.SUCCESS]: alertVariants.SUCCESS,
  [types.DANGER]: alertVariants.DANGER,
  [types.WARNING]: alertVariants.WARNING,
}

const StyledToast = styled.div`
  right: 16px;
  position: fixed;
  max-width: calc(100% - 32px);
  transition: all 250ms ease-in;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 400px;
  }
`

const Toast: React.FC<ToastProps> = ({ toast, onRemove, style, ttl, ...props }) => {
  const timer = useRef<number>()
  const ref = useRef(null)
  const removeHandler = useRef(onRemove)
  const { id, title, description, type } = toast

  const handleRemove = useCallback(() => {
    removeHandler.current(id)
  }, [id, removeHandler])

  const handleMouseEnter = () => {
    clearTimeout(timer.current)
  }

  const handleMouseLeave = () => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      handleRemove()
    }, ttl)
  }

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      handleRemove()
    }, ttl)

    return () => {
      clearTimeout(timer.current)
    }
  }, [timer, ttl, handleRemove])
  console.log('aaaaaa', title, description)
  return (
    <StyledToast ref={ref} style={style}>
      <Alert title={title} variant={alertTypeMap[type]} onClick={handleRemove}>
        {description}
      </Alert>
    </StyledToast>
  )
}

export default Toast
