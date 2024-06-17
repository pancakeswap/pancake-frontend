import { useDelayedUnmount } from "@pancakeswap/hooks";
import React, { useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useMatchBreakpoints } from "../../contexts";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import getPortalRoot from "../../util/getPortalRoot";
import { Box } from "../Box";
import { IconButton } from "../Button";
import { Overlay } from "../Overlay";
import { CloseIcon } from "../Svg";
import { DrawerContainer } from "./styles";

interface BottomDrawerProps {
  content: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>> | null;
}

const BottomDrawer: React.FC<React.PropsWithChildren<BottomDrawerProps>> = ({ content, isOpen, setIsOpen }) => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldRender = useDelayedUnmount(isOpen, 350);
  const { isDesktop } = useMatchBreakpoints();

  useOnClickOutside(
    ref?.current,
    useCallback(() => setIsOpen?.(false), [setIsOpen])
  );

  if (!shouldRender || isDesktop) {
    return null;
  }

  const portal = getPortalRoot();

  if (portal)
    return createPortal(
      <>
        <Overlay isUnmounting={!isOpen} />
        <DrawerContainer ref={ref} isUnmounting={!isOpen}>
          <Box position="absolute" right="16px" top="0">
            <IconButton variant="text" onClick={() => setIsOpen?.(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {content}
        </DrawerContainer>
      </>,
      portal
    );
  return null;
};

export default BottomDrawer;
