import { ToastData } from "../../components/Toast";

type ToastSignature = (title: ToastData["title"], description?: ToastData["description"]) => void;
export interface ToastContextApi {
  toasts: ToastData[];
  clear: () => void;
  remove: (id: string) => void;
  toastError: ToastSignature;
  toastInfo: ToastSignature;
  toastSuccess: ToastSignature;
  toastWarning: ToastSignature;
}
