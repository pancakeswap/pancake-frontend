import { useModalV2 } from "../../widgets/Modal/ModalV2";
import { Dialog } from "./Dialog";
import { PromptFn } from "./DialogContext";

export const usePromptV2 = ({ message, onConfirm, defaultValue = "", title = "Warning" }: Parameters<PromptFn>[0]) => {
  const { onDismiss, onOpen, isOpen } = useModalV2();
  return [
    <Dialog
      useInput
      isOpen={isOpen}
      message={message}
      defaultValue={defaultValue}
      onConfirm={onConfirm}
      onDismiss={onDismiss}
      title={title}
    />,
    onOpen,
  ];
};
