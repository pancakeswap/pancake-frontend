import React from "react";
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
  return (
    <ModalV2 isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
      <ModalWrapper onDismiss={() => setIsOpen(false)}>
        <DrawerContainer>
          <Box position="absolute" right="24px" top="24px">
            <ModalCloseButton onDismiss={() => setIsOpen(false)} />
          </Box>
          {content}
        </DrawerContainer>
      </ModalWrapper>
    </ModalV2>
  );
};

export default BottomDrawer;
