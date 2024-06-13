import { useDialogContext } from "./DialogContext";

export const useConfirm = () => {
  const { confirm } = useDialogContext();

  return confirm;
};
