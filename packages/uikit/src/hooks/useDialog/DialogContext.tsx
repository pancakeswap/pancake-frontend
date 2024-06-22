import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useModalV2 } from "../../widgets/Modal/ModalV2";
import { Dialog } from "./Dialog";

export type PromptFn = (params: {
  title?: string;
  message?: string;
  defaultValue?: string;
  onConfirm: (value: string) => void;
}) => void;

export type ConfirmFn = (params: { title?: string; message?: string; onConfirm: (value: boolean) => void }) => void;

export type DialogOptions = {
  title?: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm: Parameters<PromptFn>[0]["onConfirm"] | Parameters<ConfirmFn>[0]["onConfirm"];

  useInput: boolean;
};

type DialogContext = {
  prompt: PromptFn;
  confirm: ConfirmFn;

  options: DialogOptions;

  isOpen: boolean;
  onOpen: () => void;
  onDismiss: () => void;
};
const defaultContextValue: DialogContext = {
  prompt: () => {},
  confirm: () => {},

  options: {
    title: "",
    message: "",
    defaultValue: "",
    placeholder: "",
    confirmText: "",
    cancelText: "",
    onConfirm: () => {},
    useInput: false,
  },

  isOpen: false,
  onOpen: () => {},
  onDismiss: () => {},
};

export const Context = createContext<DialogContext>(defaultContextValue);

export const DialogProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { onDismiss, onOpen, isOpen } = useModalV2();
  const [options, setOptions] = useState<DialogOptions>(defaultContextValue.options);

  const prompt = useCallback<PromptFn>(
    (newOptions) => {
      setOptions({
        ...newOptions,
        useInput: true,
      });
      onOpen();
    },
    [onOpen, setOptions]
  );

  const confirm = useCallback<ConfirmFn>(
    (newOptions) => {
      setOptions({
        ...newOptions,
        useInput: false,
      });
      onOpen();
    },
    [onOpen, setOptions]
  );

  const providerValue: DialogContext = useMemo(() => {
    return {
      prompt,
      confirm,
      options,
      isOpen,
      onOpen,
      onDismiss,
    };
  }, [confirm, isOpen, onDismiss, onOpen, options, prompt]);

  return (
    <Context.Provider value={providerValue}>
      <DialogGlobal />
      {children}
    </Context.Provider>
  );
};

export const useDialogContext = () => {
  const ctx = useContext(Context);

  if (!ctx) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }

  return ctx;
};

export const useDialogOptions = () => {
  const { options, isOpen, onOpen, onDismiss } = useDialogContext();

  return { ...options, isOpen, onOpen, onDismiss };
};

export const DialogGlobal = () => {
  const options = useDialogOptions();

  return <Dialog {...options} />;
};
