import { ReactElement, createContext, useCallback, useEffect, useMemo } from "react";
import { ExternalToast, toast as sonnerToast, ToastT } from "sonner";
import { useIsWindowVisible } from "@pancakeswap/hooks";
import { Toast, ToastData, types } from "../../components/Toast";
import { ToastContextApi } from "./types";

export const ToastsContext = createContext<ToastContextApi | undefined>(undefined);

const toasts = new Map<string | number, { component: ReactElement; externalData?: ExternalToast }>();

function checkIsWindowVisible() {
  if (!(typeof document !== "undefined" && "visibilityState" in document)) {
    return true;
  }
  return document.visibilityState === "visible";
}

export const ToastsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isWindowVisible = useIsWindowVisible();

  const deleteCallback = useCallback((toast: ToastT) => {
    toasts.delete(toast.id);
  }, []);

  useEffect(() => {
    if (isWindowVisible) {
      toasts.forEach((data, key) => {
        if (data.externalData?.duration === Infinity) {
          sonnerToast.custom(() => data.component, {
            ...data.externalData,
            id: key,
            duration: 6000,
            onDismiss: deleteCallback,
            onAutoClose: deleteCallback,
          });
        }
      });
    }
  }, [isWindowVisible, deleteCallback]);

  const toastError = useCallback(
    (title: ToastData["title"], description?: ToastData["description"], externalData?: ExternalToast) => {
      const toastExternalData = {
        ...externalData,
        ...(!checkIsWindowVisible() && {
          duration: Infinity,
        }),
        onDismiss: deleteCallback,
        onAutoClose: deleteCallback,
      };
      return sonnerToast.custom((t) => {
        const component = (
          <Toast
            toast={{
              id: t,
              title,
              description,
              type: types.DANGER,
            }}
            onRemove={() => {
              toasts.delete(t);
              sonnerToast.dismiss(t);
            }}
          >
            {description}
          </Toast>
        );
        toasts.set(t, { component, externalData: toastExternalData });
        return component;
      }, toastExternalData);
    },
    [deleteCallback]
  );

  const toastInfo = useCallback(
    (title: ToastData["title"], description?: ToastData["description"], externalData?: ExternalToast) => {
      const toastExternalData = {
        ...externalData,
        ...(!checkIsWindowVisible() && {
          duration: Infinity,
        }),
        onDismiss: deleteCallback,
        onAutoClose: deleteCallback,
      };
      return sonnerToast.custom((t) => {
        const component = (
          <Toast
            toast={{
              id: t,
              title,
              description,
              type: types.INFO,
            }}
            onRemove={() => {
              toasts.delete(t);
              sonnerToast.dismiss(t);
            }}
          >
            {description}
          </Toast>
        );
        toasts.set(t, { component, externalData: toastExternalData });
        return component;
      }, toastExternalData);
    },
    [deleteCallback]
  );

  const toastSuccess = useCallback(
    (title: ToastData["title"], description?: ToastData["description"], externalData?: ExternalToast) => {
      const toastExternalData = {
        ...externalData,
        ...(!checkIsWindowVisible() && {
          duration: Infinity,
        }),
        onDismiss: deleteCallback,
        onAutoClose: deleteCallback,
      };
      return sonnerToast.custom((t) => {
        const component = (
          <Toast
            toast={{
              id: t,
              title,
              description,
              type: types.SUCCESS,
            }}
            onRemove={() => {
              toasts.delete(t);
              sonnerToast.dismiss(t);
            }}
          >
            {description}
          </Toast>
        );
        toasts.set(t, { component, externalData: toastExternalData });
        return component;
      }, toastExternalData);
    },
    [deleteCallback]
  );

  const toastWarning = useCallback(
    (title: ToastData["title"], description?: ToastData["description"], externalData?: ExternalToast) => {
      const toastExternalData = {
        ...externalData,
        ...(!checkIsWindowVisible() && {
          duration: Infinity,
        }),
        onDismiss: deleteCallback,
        onAutoClose: deleteCallback,
      };
      return sonnerToast.custom((t) => {
        const component = (
          <Toast
            toast={{
              id: t,
              title,
              description,
              type: types.WARNING,
            }}
            onRemove={() => {
              toasts.delete(t);
              sonnerToast.dismiss(t);
            }}
          >
            {description}
          </Toast>
        );
        toasts.set(t, { component, externalData: toastExternalData });
        return component;
      }, toastExternalData);
    },
    [deleteCallback]
  );

  const clear = useCallback(() => {
    toasts.clear();
    sonnerToast.dismiss();
  }, []);
  const remove = useCallback((id: string | number) => {
    toasts.delete(id);
    sonnerToast.dismiss(id);
  }, []);

  const providerValue = useMemo(() => {
    return { clear, remove, toastError, toastInfo, toastSuccess, toastWarning };
  }, [clear, remove, toastError, toastInfo, toastSuccess, toastWarning]);

  return <ToastsContext.Provider value={providerValue}>{children}</ToastsContext.Provider>;
};
