import { useModalV2 } from "../../widgets/Modal/ModalV2";
import { PromptModal } from "./PromptModal";

export type UsePromptParams = {
  message?: string;
  onConfirm: (value: string) => void;
  defaultValue?: string;
};

/**
 * use prompt without context
 */
export const usePromptV2 = ({ message, onConfirm, defaultValue = "" }: UsePromptParams): [JSX.Element, () => void] => {
  const { onDismiss, onOpen, isOpen } = useModalV2();

  return [
    <PromptModal
      isOpen={isOpen}
      message={message}
      defaultValue={defaultValue}
      onConfirm={onConfirm}
      onDismiss={onDismiss}
    />,
    onOpen,
  ];
};
