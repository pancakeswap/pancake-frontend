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
  drawerContainerStyle?: React.CSSProperties;
}

const BottomDrawer: React.FC<React.PropsWithChildren<BottomDrawerProps>> = ({
  drawerContainerStyle = {},
  content,
  isOpen,
  setIsOpen,
}) => {
  return (
    <ModalV2 isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
      <ModalWrapper onDismiss={() => setIsOpen(false)}>
        <DrawerContainer style={drawerContainerStyle}>
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
