import React, { createContext, useCallback, useState } from 'react'
import { kebabCase } from 'lodash'
import { Toast, toastTypes } from 'components/Toast'
import { ToastContextApi } from './types'

export const ToastsContext = createContext<ToastContextApi>(undefined)

export const ToastsProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<ToastContextApi['toasts']>([])

  const toast = useCallback(
    ({ title, description, type, tx }: Omit<Toast, 'id'>) => {
      setToasts((prevToasts) => {
        const id = kebabCase(title)

        // Remove any existing toasts with the same id
        const currentToasts = prevToasts.filter((prevToast) => prevToast.id !== id)

        return [
          {
            id,
            title,
            description,
            type,
            tx,
          },
          ...currentToasts,
        ]
      })
    },
    [setToasts],
  )

  const toastError = (title: Toast['title'], description?: Toast['description'], tx?: Toast['tx']) => {
    return toast({ title, description, type: toastTypes.DANGER, tx })
  }
  const toastInfo = (title: Toast['title'], description?: Toast['description'], tx?: Toast['tx']) => {
    return toast({ title, description, type: toastTypes.INFO, tx })
  }
  const toastSuccess = (title: Toast['title'], description?: Toast['description'], tx?: Toast['tx']) => {
    return toast({ title, description, type: toastTypes.SUCCESS, tx })
  }
  const toastWarning = (title: Toast['title'], description?: Toast['description'], tx?: Toast['tx']) => {
    return toast({ title, description, type: toastTypes.WARNING, tx })
  }
  const clear = () => setToasts([])
  const remove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id))
  }

  return (
    <ToastsContext.Provider value={{ toasts, clear, remove, toastError, toastInfo, toastSuccess, toastWarning }}>
      {children}
    </ToastsContext.Provider>
  )
}
