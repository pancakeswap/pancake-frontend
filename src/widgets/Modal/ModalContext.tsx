import React, { createContext, useState } from "react";
import styled from "styled-components";
import Overlay from "../../components/Overlay/Overlay";
import { ModalProps } from "./types";

interface ModalsContext extends ModalProps {
  onPresent: (node: React.ReactNode, key?: string) => void;
}

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
`;

export const Context = createContext<ModalsContext>({
  onPresent: () => null,
  onDismiss: () => null,
});

const ModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalNode, setModalNode] = useState<React.ReactNode>();

  const handlePresent = (node: React.ReactNode) => {
    setModalNode(node);
    setIsOpen(true);
  };

  const handleDismiss = () => {
    setModalNode(undefined);
    setIsOpen(false);
  };

  return (
    <Context.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      {isOpen && (
        <ModalWrapper>
          <Overlay show onClick={handleDismiss} />
          {React.isValidElement(modalNode) &&
            React.cloneElement(modalNode, {
              onDismiss: handleDismiss,
            })}
        </ModalWrapper>
      )}
      {children}
    </Context.Provider>
  );
};

export default ModalProvider;
