import { AtomBox, AtomBoxProps } from "@pancakeswap/ui/components/AtomBox";
import React from "react";
import { createPortal } from "react-dom";
import { Overlay } from "../../components/Overlay";
import getPortalRoot from "../../util/getPortalRoot";

export interface ModalV2Props {
  isOpen?: boolean;
  onDismiss?: () => void;
  closeOnOverlayClick?: boolean;
  children?: React.ReactNode;
}

export function ModalV2({ isOpen, onDismiss, closeOnOverlayClick, children, ...props }: ModalV2Props & AtomBoxProps) {
  const handleOverlayDismiss = () => {
    if (closeOnOverlayClick) {
      onDismiss?.();
    }
  };
  const portal = getPortalRoot();

  if (portal) {
    return createPortal(
      isOpen && (
        <AtomBox
          display="flex"
          inset="0"
          flexDirection="column"
          justifyContent={{
            xs: "flex-end",
            md: "center",
          }}
          alignItems="center"
          position="fixed"
          zIndex="99"
          {...props}
        >
          <Overlay onClick={handleOverlayDismiss} />
          {children}
        </AtomBox>
      ),
      portal
    );
  }

  return null;
}
