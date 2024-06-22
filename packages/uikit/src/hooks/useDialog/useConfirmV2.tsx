import { useModalV2 } from "../../widgets/Modal/ModalV2";
import { Dialog } from "./Dialog";
import { ConfirmFn } from "./DialogContext";

export const useConfirmV2 = ({ message, onConfirm, title = "Confirm" }: Parameters<ConfirmFn>[0]) => {
  const { onDismiss, onOpen, isOpen } = useModalV2();

  return [
    <Dialog
      useInput={false}
      isOpen={isOpen}
      onConfirm={onConfirm}
      onDismiss={onDismiss}
      title={title}
      message={message}
    />,
    onOpen,
  ];
};
