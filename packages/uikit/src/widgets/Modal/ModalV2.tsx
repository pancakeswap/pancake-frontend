import { AnimatePresence, domMax, LazyMotion } from "framer-motion";
import React, { createContext, ReactEventHandler, useCallback, useRef, useState } from "react";
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

export const ModalV2Context = createContext<{
  onDismiss?: () => void;
}>({});

export type UseModalV2Props = ReturnType<typeof useModalV2>;
export function useModalV2() {
  const [isOpen, setIsOpen] = useState(false);

  const onDismiss = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);

  return {
    onDismiss,
    onOpen,
    isOpen,
    setIsOpen,
  };
}

export function ModalV2({ isOpen, onDismiss, closeOnOverlayClick, children, ...props }: ModalV2Props & BoxProps) {
  const animationRef = useRef<HTMLDivElement>(null);

  const handleOverlayDismiss: ReactEventHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (closeOnOverlayClick) {
      onDismiss?.();
    }
  };
  const portal = getPortalRoot();

  if (portal) {
    return createPortal(
      <ModalV2Context.Provider value={{ onDismiss }}>
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
        </LazyMotion>
      </ModalV2Context.Provider>,
      portal
    );
  }

  return null;
}
