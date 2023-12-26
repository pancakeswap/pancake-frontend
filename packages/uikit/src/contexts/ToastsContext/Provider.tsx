import { createContext, useCallback, useMemo } from "react";
import { ExternalToast, toast as sonnerToast } from "sonner";
import { Toast, ToastData, types } from "../../components/Toast";
import { ToastContextApi } from "./types";

export const ToastsContext = createContext<ToastContextApi | undefined>(undefined);

export const ToastsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const toastError = useCallback(
    (title: ToastData["title"], description?: ToastData["description"], externalData?: ExternalToast) => {
      return sonnerToast.custom(
        (t) => (
          <Toast
            toast={{
              id: t,
              title,
              description,
              type: types.DANGER,
            }}
            onRemove={() => sonnerToast.dismiss(t)}
          >
            {description}
          </Toast>
        ),
        externalData
      );
    },
    []
  );

  const toastInfo = useCallback(
    (title: ToastData["title"], description?: ToastData["description"], externalData?: ExternalToast) => {
      return sonnerToast.custom(
        (t) => (
          <Toast
            toast={{
              id: t,
              title,
              description,
              type: types.INFO,
            }}
            onRemove={() => sonnerToast.dismiss(t)}
          >
            {description}
          </Toast>
        ),
        externalData
      );
    },
    []
  );

  const toastSuccess = useCallback(
    (title: ToastData["title"], description?: ToastData["description"], externalData?: ExternalToast) => {
      return sonnerToast.custom(
        (t) => (
          <Toast
            toast={{
              id: t,
              title,
              description,
              type: types.SUCCESS,
            }}
            onRemove={() => sonnerToast.dismiss(t)}
          >
            {description}
          </Toast>
        ),
        externalData
      );
    },
    []
  );

  const toastWarning = useCallback(
    (title: ToastData["title"], description?: ToastData["description"], externalData?: ExternalToast) => {
      return sonnerToast.custom(
        (t) => (
          <Toast
            toast={{
              id: t,
              title,
              description,
              type: types.WARNING,
            }}
            onRemove={() => sonnerToast.dismiss(t)}
          >
            {description}
          </Toast>
        ),
        externalData
      );
    },
    []
  );

  const clear = useCallback(() => sonnerToast.dismiss(), []);
  const remove = useCallback((id: string | number) => {
    sonnerToast.dismiss(id);
  }, []);

  const providerValue = useMemo(() => {
    return { clear, remove, toastError, toastInfo, toastSuccess, toastWarning };
  }, [clear, remove, toastError, toastInfo, toastSuccess, toastWarning]);

  return <ToastsContext.Provider value={providerValue}>{children}</ToastsContext.Provider>;
};
