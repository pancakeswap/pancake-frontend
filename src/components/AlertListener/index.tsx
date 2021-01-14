import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Alert, State } from 'state/types'
import Toast from './Toast'

const ZINDEX = 900
const TOP = 80
const STACK_SPACING = 24

const AlertListener = () => {
  const alerts: Alert[] = useSelector((state: State) => state.alerts.data.slice())
  const ref = useRef()

  return (
    <TransitionGroup>
      {alerts.reverse().map((alert, index) => {
        const zIndex = ZINDEX - index
        const top = TOP + index * STACK_SPACING

        return (
          <CSSTransition key={alert.id} nodeRef={ref} timeout={0} classNames="alert">
            <Toast ref={ref} alert={alert} zIndex={zIndex} top={top} />
          </CSSTransition>
        )
      })}
    </TransitionGroup>
  )
}

export default AlertListener
