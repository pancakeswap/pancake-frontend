import React from "react";
import styled from "styled-components";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import Flex from "../../components/Flex";
import { CloseIcon } from "../../components/Svg";

interface Props {
  title: string;
  onDismiss: () => void;
}

const StyledModal = styled.div`
  background: #ffffff;
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(14, 14, 44, 0.05);
  border-radius: 32px;
  width: 100%;
  z-index: 11;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: auto;
    min-width: 360px;
    max-width: 100%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9eaeb;
  align-items: center;
  padding: 12px 24px;
`;

const CloseButton = styled(Button)`
  padding: 8px;
  width: 48px;
`;

const Modal: React.FC<Props> = ({ title, onDismiss, children }) => (
  <StyledModal>
    <ModalHeader>
      <Heading>{title}</Heading>
      <CloseButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
        <CloseIcon color="primary" onClick={onDismiss} />
      </CloseButton>
    </ModalHeader>
    <Flex flexDirection="column" p="24px">
      {children}
    </Flex>
  </StyledModal>
);

export default Modal;
