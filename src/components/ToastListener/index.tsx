import { ToastContainer } from '@pancakeswap-libs/uikit'
import React from 'react'
import { useSelector } from 'react-redux'
import { useAlert } from 'state/hooks'
import { Alert, State } from 'state/types'

const AlertListener = () => {
  const alerts: Alert[] = useSelector((state: State) => state.alerts.data.slice())
  const { remove } = useAlert()

  const handleRemove = (id: string) => remove(id)
  return <ToastContainer alerts={alerts} onRemove={handleRemove} />
}

export default AlertListener
