import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useModalV2 } from "../../widgets/Modal/ModalV2";
import { PromptModal } from "./PromptModal";

export type PromptOptions = {
  title?: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm: (value: string) => void;
};

export type PromptContext = {
  prompt: (params: {
    title?: string;
    message?: string;
    defaultValue?: string;
    onConfirm: (value: string) => void;
  }) => void;

  options: PromptOptions;

  isOpen: boolean;
  onOpen: () => void;
  onDismiss: () => void;
};

const defaultContextValue: PromptContext = {
  prompt: () => {},

  options: {
    title: "",
    message: "",
    defaultValue: "",
    placeholder: "",
    confirmText: "",
    cancelText: "",
    onConfirm: () => {},
  },

  isOpen: false,
  onOpen: () => {},
  onDismiss: () => {},
};

export const Context = createContext<PromptContext>(defaultContextValue);

export const PromptProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { onDismiss, onOpen, isOpen } = useModalV2();
  const [options, setOptions] = useState<PromptOptions>(defaultContextValue.options);

  const prompt = useCallback<PromptContext["prompt"]>(
    (newOptions) => {
      setOptions({
        ...newOptions,
      });
      onOpen();
    },
    [onOpen, setOptions]
  );

  const providerValue: PromptContext = useMemo(() => {
    return {
      options,
      prompt,
      isOpen,
      onOpen,
      onDismiss,
    };
  }, [options, prompt, isOpen, onOpen, onDismiss]);

  return (
    <Context.Provider value={providerValue}>
      <PromptModalGlobal />
      {children}
    </Context.Provider>
  );
};

export const usePromptContext = () => {
  const ctx = useContext(Context);

  if (!ctx) {
    throw new Error("usePromptContext must be used within a PromptProvider");
  }

  return ctx;
};

export const usePromptOptions = () => {
  const { options, isOpen, onOpen, onDismiss } = usePromptContext();

  return { ...options, isOpen, onOpen, onDismiss };
};

export const PromptModalGlobal = () => {
  const options = usePromptOptions();

  return <PromptModal {...options} />;
};
