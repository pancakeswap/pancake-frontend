import React, { PropsWithChildren, useContext, useRef } from "react";
import { useTheme } from "styled-components";
import Heading from "../../components/Heading/Heading";
import getThemeValue from "../../util/getThemeValue";
import { ModalBody, ModalHeader, ModalTitle, ModalContainer, ModalCloseButton, ModalBackButton } from "./styles";
import { ModalProps, ModalWrapperProps } from "./types";
import { useMatchBreakpoints } from "../../contexts";
import { ModalV2Context } from "./ModalV2";
import { Box } from "../../components/Box";

export const MODAL_SWIPE_TO_CLOSE_VELOCITY = 300;

export const ModalWrapper = ({
  children,
  onDismiss,
  hideCloseButton,
  ...props
}: PropsWithChildren<ModalWrapperProps>) => {
  const { isMobile } = useMatchBreakpoints();
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    // @ts-ignore
    <ModalContainer
      drag={isMobile && !hideCloseButton ? "y" : false}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={{ top: 0 }}
      dragSnapToOrigin
      onDragStart={() => {
        if (wrapperRef.current) wrapperRef.current.style.animation = "none";
      }}
      // @ts-ignore
      onDragEnd={(e, info) => {
        if (info.velocity.y > MODAL_SWIPE_TO_CLOSE_VELOCITY && onDismiss) onDismiss();
      }}
      ref={wrapperRef}
      style={{ overflow: "visible" }}
    >
      <Box overflow="hidden" borderRadius="32px" {...props}>
        {children}
      </Box>
    </ModalContainer>
  );
};

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  title,
  onDismiss: onDismiss_,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = "24px",
  headerBackground = "transparent",
  minWidth = "320px",
  headerRightSlot,
  bodyAlignItems,
  ...props
}) => {
  const context = useContext(ModalV2Context);
  const onDismiss = context?.onDismiss || onDismiss_;
  const theme = useTheme();
  return (
    <ModalWrapper minWidth={minWidth} onDismiss={onDismiss} hideCloseButton={hideCloseButton} {...props}>
      <ModalHeader background={getThemeValue(theme, `colors.${headerBackground}`, headerBackground)}>
        <ModalTitle>
          {onBack && <ModalBackButton onBack={onBack} />}
          <Heading>{title}</Heading>
        </ModalTitle>
        {headerRightSlot}
        {!hideCloseButton && <ModalCloseButton onDismiss={onDismiss} />}
      </ModalHeader>
      <ModalBody
        // prevent drag event from propagating to parent on scroll
        onPointerDownCapture={(e) => e.stopPropagation()}
        p={bodyPadding}
        style={{ alignItems: bodyAlignItems ?? "normal" }}
      >
        {children}
      </ModalBody>
    </ModalWrapper>
  );
};

export default Modal;
