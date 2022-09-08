import { useCallback } from "react";
import { ToastContainer } from "../../components/Toast";
import { useToast } from "./useToast";

const ToastListener = () => {
  const { toasts, remove } = useToast();

  const handleRemove = useCallback((id: string) => remove(id), [remove]);

  return <ToastContainer toasts={toasts} onRemove={handleRemove} />;
};

export default ToastListener;
