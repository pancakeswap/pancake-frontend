import { m } from "framer-motion";
import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { Overlay } from "../../components/Overlay";
import getPortalRoot from "../../util/getPortalRoot";

const ModalWrapper = styled(m.div)`
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

export function ModalV2({
  isOpen,
  onDismiss,
  closeOnOverlayClick,
  children,
}: {
  isOpen?: boolean;
  onDismiss?: () => void;
  closeOnOverlayClick?: boolean;
  children?: React.ReactNode;
}) {
  const handleOverlayDismiss = () => {
    if (closeOnOverlayClick) {
      onDismiss?.();
    }
  };
  const portal = getPortalRoot();

  if (portal) {
    return createPortal(
      isOpen && (
        <ModalWrapper>
          <Overlay onClick={handleOverlayDismiss} />
          {children}
        </ModalWrapper>
      ),
      portal
    );
  }

  return null;
}
