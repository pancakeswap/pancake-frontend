import React, { PropsWithChildren, useContext, useLayoutEffect, useRef } from "react";
import { useTheme } from "styled-components";
import { Box } from "../../components/Box";
import Heading from "../../components/Heading/Heading";
import { useMatchBreakpoints } from "../../contexts";
import getThemeValue from "../../util/getThemeValue";
import { ModalV2Context } from "./ModalV2";
import { ModalBackButton, ModalBody, ModalCloseButton, ModalContainer, ModalHeader, ModalTitle } from "./styles";
import { ModalProps, ModalWrapperProps } from "./types";

export const MODAL_SWIPE_TO_CLOSE_VELOCITY = 300;

export const ModalWrapper = ({
  children,
  onDismiss,
  hideCloseButton,
  minHeight,
  ...props
}: PropsWithChildren<ModalWrapperProps>) => {
  const { isMobile } = useMatchBreakpoints();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height } = entry.contentRect;

        if (wrapperRef.current) {
          wrapperRef.current.style.height = `${height}px`;
        }
      }
    });

    if (innerRef.current) {
      resizeObserver.observe(innerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
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
      style={{
        overflow: "hidden",
        willChange: "height",
        transition: "height 0.3s cubic-bezier(.19,.23,.75,1.05)",
      }}
      $minHeight={minHeight}
    >
      <Box ref={innerRef} overflow="hidden" borderRadius="32px" {...props}>
        {children}
      </Box>
    </ModalContainer>
  );
};

const MotionModal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  title,
  onDismiss: onDismiss_,
  onBack,
  children,
  hideCloseButton = false,
  headerPadding = "12px 24px",
  bodyPadding = "24px",
  headerBackground = "transparent",
  minWidth = "320px",
  minHeight = "300px",
  headerRightSlot,
  bodyAlignItems,
  headerBorderColor,
  bodyTop = "0px",
  ...props
}) => {
  const context = useContext(ModalV2Context);
  const onDismiss = context?.onDismiss || onDismiss_;
  const theme = useTheme();
  return (
    <ModalWrapper
      minWidth={minWidth}
      minHeight={minHeight}
      onDismiss={onDismiss}
      hideCloseButton={hideCloseButton}
      {...props}
    >
      <ModalHeader
        background={getThemeValue(theme, `colors.${headerBackground}`, headerBackground)}
        style={{ padding: headerPadding }}
        headerBorderColor={headerBorderColor}
      >
        <ModalTitle>
          {onBack && <ModalBackButton onBack={onBack} />}
          <Heading>{title}</Heading>
        </ModalTitle>
        {headerRightSlot}
        {!hideCloseButton && <ModalCloseButton onDismiss={onDismiss} />}
      </ModalHeader>
      <ModalBody
        position="relative"
        top={bodyTop}
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

export default MotionModal;
