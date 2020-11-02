import { useCallback, useContext } from "react";
import { Context } from "./ModalContext";

const useModal = (modal: React.ReactNode): [() => void, () => void] => {
  const { onPresent, onDismiss } = useContext(Context);
  const onPresentCallback = useCallback(() => {
    onPresent(modal);
  }, [modal, onPresent]);

  return [onPresentCallback, onDismiss];
};

export default useModal;
