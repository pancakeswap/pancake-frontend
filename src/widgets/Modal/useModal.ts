import { useCallback, useContext, useEffect } from "react";
import { Context } from "./ModalContext";
import { Handler } from "./types";

const useModal = (modal: React.ReactNode, closeOnOverlayClick = true): [Handler, Handler] => {
  const { onPresent, onDismiss, setCloseOnOverlayClick } = useContext(Context);
  const onPresentCallback = useCallback(() => {
    onPresent(modal);
  }, [modal, onPresent]);

  useEffect(() => {
    setCloseOnOverlayClick(closeOnOverlayClick);
  }, [closeOnOverlayClick, setCloseOnOverlayClick]);

  return [onPresentCallback, onDismiss];
};

export default useModal;
