import { ExternalToast } from "sonner";
import { ToastData } from "../../components/Toast";

type ToastId = string | number;

type ToastSignature = (
  title: ToastData["title"],
  description?: ToastData["description"],
  externalData?: ExternalToast
) => ToastId;

export interface ToastContextApi {
  clear: () => void;
  remove: (id: string | number) => void;
  toastError: ToastSignature;
  toastInfo: ToastSignature;
  toastSuccess: ToastSignature;
  toastWarning: ToastSignature;
}
