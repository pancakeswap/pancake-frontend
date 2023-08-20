import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import React, { createContext, useCallback, useMemo, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { mountAnimation, unmountAnimation } from "../../components/BottomDrawer/styles";
import { Overlay } from "../../components/Overlay";
import { useIsomorphicEffect } from "../../hooks";
import {
  animationHandler,
  animationMap,
  animationVariants,
  appearAnimation,
  disappearAnimation,
} from "../../util/animationToolkit";
import getPortalRoot from "../../util/getPortalRoot";
import { ModalContainer } from "./styles";
import { Handler } from "./types";

const DomMax = () => import("./motionDomMax").then((mod) => mod.default);
const DomAnimation = () => import("./motionDomAnimation").then((mod) => mod.default);

interface ModalsContext {
  isOpen: boolean;
  nodeId: string;
  modalNode: React.ReactNode;
  setModalNode: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  onPresent: (node: React.ReactNode, newNodeId: string, closeOverlayClick: boolean) => void;
  onDismiss: Handler;
}

export const StyledModalWrapper = styled(m.div)`
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
  will-change: opacity;
  opacity: 0;
  &.appear {
    animation: ${appearAnimation} 0.3s ease-in-out forwards;
    ${ModalContainer} {
      animation: ${mountAnimation} 0.3s ease-in-out forwards;
      ${({ theme }) => theme.mediaQueries.md} {
        animation: none;
      }
    }
  }
  &.disappear {
    animation: ${disappearAnimation} 0.3s ease-in-out forwards;
    ${ModalContainer} {
      animation: ${unmountAnimation} 0.3s ease-in-out forwards;
      ${({ theme }) => theme.mediaQueries.md} {
        animation: none;
      }
    }
  }
`;

export const Context = createContext<ModalsContext>({
  isOpen: false,
  nodeId: "",
  modalNode: null,
  setModalNode: () => null,
  onPresent: () => null,
  onDismiss: () => null,
});

const ModalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalNode, setModalNode] = useState<React.ReactNode>();
  const [nodeId, setNodeId] = useState("");
  const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);
  const animationRef = useRef<HTMLDivElement>(null);

  useIsomorphicEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    return () => window.removeEventListener("resize", setViewportHeight);
  }, []);

  const handlePresent = useCallback((node: React.ReactNode, newNodeId: string, closeOverlayClick: boolean) => {
    setModalNode(node);
    setIsOpen(true);
    setNodeId(newNodeId);
    setCloseOnOverlayClick(closeOverlayClick);
  }, []);

  const handleDismiss = useCallback(() => {
    setModalNode(undefined);
    setIsOpen(false);
    setNodeId("");
    setCloseOnOverlayClick(true);
  }, []);

  const handleOverlayDismiss = useCallback(() => {
    if (closeOnOverlayClick) {
      handleDismiss();
    }
  }, [closeOnOverlayClick, handleDismiss]);

  const providerValue = useMemo(() => {
    return { isOpen, nodeId, modalNode, setModalNode, onPresent: handlePresent, onDismiss: handleDismiss };
  }, [isOpen, nodeId, modalNode, setModalNode, handlePresent, handleDismiss]);

  const portal = useMemo(() => getPortalRoot(), []);

  return (
    <Context.Provider value={providerValue}>
      {portal &&
        createPortal(
          <LazyMotion features={isMobile ? DomMax : DomAnimation}>
            <AnimatePresence>
              {isOpen && (
                <DismissableLayer
                  role="dialog"
                  disableOutsidePointerEvents={false}
                  onEscapeKeyDown={handleOverlayDismiss}
                >
                  <StyledModalWrapper
                    ref={animationRef}
                    onAnimationStart={() => animationHandler(animationRef.current)}
                    {...animationMap}
                    variants={animationVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <Overlay onClick={handleOverlayDismiss} />
                    {React.isValidElement(modalNode) &&
                      React.cloneElement(modalNode, {
                        // @ts-ignore
                        onDismiss: handleDismiss,
                      })}
                  </StyledModalWrapper>
                </DismissableLayer>
              )}
            </AnimatePresence>
          </LazyMotion>,
          portal
        )}
      {children}
    </Context.Provider>
  );
};

export default ModalProvider;
