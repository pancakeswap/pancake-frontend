import { AnimatePresence, domMax, LazyMotion } from "framer-motion";
import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { BoxProps } from "../../components/Box";
import { Overlay } from "../../components/Overlay";
import { animationHandler, animationMap, animationVariants } from "../../util/animationToolkit";
import getPortalRoot from "../../util/getPortalRoot";
import { StyledModalWrapper } from "./ModalContext";

export interface ModalV2Props {
  isOpen?: boolean;
  onDismiss?: () => void;
  closeOnOverlayClick?: boolean;
  children?: React.ReactNode;
}

export function ModalV2({ isOpen, onDismiss, closeOnOverlayClick, children, ...props }: ModalV2Props & BoxProps) {
  const animationRef = useRef<HTMLDivElement>(null);

  const handleOverlayDismiss = () => {
    if (closeOnOverlayClick) {
      onDismiss?.();
    }
  };
  const portal = getPortalRoot();

  if (portal) {
    return createPortal(
      <LazyMotion features={domMax}>
        <AnimatePresence>
          {isOpen && (
            <StyledModalWrapper
              ref={animationRef}
              // @ts-ignore
              onAnimationStart={() => animationHandler(animationRef.current)}
              {...animationMap}
              variants={animationVariants}
              transition={{ duration: 0.3 }}
              {...props}
            >
              <Overlay onClick={handleOverlayDismiss} />
              {children}
            </StyledModalWrapper>
          )}
        </AnimatePresence>
      </LazyMotion>,
      portal
    );
  }

  return null;
}
