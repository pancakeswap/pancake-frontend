import React, { useCallback } from "react";
import { Box } from "../../../components";
import { ModalWrapper } from "../Modal";
import { ModalV2 } from "../ModalV2";
import { ModalCloseButton } from "../styles";
import { DrawerContainer } from "./styles";

interface BottomDrawerProps {
  content: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void | null;
}

const BottomDrawer: React.FC<React.PropsWithChildren<BottomDrawerProps>> = ({ content, isOpen, setIsOpen }) => {
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <ModalV2 isOpen={isOpen} onDismiss={handleClose}>
      <ModalWrapper onDismiss={handleClose}>
        <DrawerContainer>
          <Box position="absolute" right="24px" top="24px">
            <ModalCloseButton onDismiss={handleClose} />
          </Box>
          {content}
        </DrawerContainer>
      </ModalWrapper>
    </ModalV2>
  );
};

export default BottomDrawer;
