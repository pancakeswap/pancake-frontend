import { ToastData } from "../../components/Toast";

type ToastSignature = (title: ToastData["title"], description?: ToastData["description"]) => void;
export interface ToastContextApi {
  clear: () => void;
  remove: (id: string | number) => void;
  toastError: ToastSignature;
  toastInfo: ToastSignature;
  toastSuccess: ToastSignature;
  toastWarning: ToastSignature;
}
