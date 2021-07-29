import { Toast } from '@ricefarm/uikitv2'

type ToastSignature = (title: Toast['title'], description?: Toast['description']) => void

export interface ToastContextApi {
  toasts: Toast[]
  clear: () => void
  remove: (id: string) => void
  toastError: ToastSignature
  toastInfo: ToastSignature
  toastSuccess: ToastSignature
  toastWarning: ToastSignature
}
