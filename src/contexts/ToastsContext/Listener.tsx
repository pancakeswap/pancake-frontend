import { ToastContainer } from 'components/Toast'
import useToast from 'hooks/useToast'
import { useCallback } from 'react'

const ToastListener = () => {
  const { toasts, remove } = useToast()

  const handleRemove = useCallback((id: string) => remove(id), [remove])

  return <ToastContainer toasts={toasts} onRemove={handleRemove} />
}

export default ToastListener
