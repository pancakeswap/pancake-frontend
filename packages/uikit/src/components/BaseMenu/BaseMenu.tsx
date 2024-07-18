import React, { useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { ClickableElementContainer } from "./styles";
import { BaseMenuProps } from "./types";
import getPortalRoot from "../../util/getPortalRoot";

export type ChildrenFunctionProps = {
  toggle: () => void;
  open: () => void;
  close: () => void;
  update: (() => void) | null;
};

const BaseMenu: React.FC<BaseMenuProps & { children: ReactNode | ((props: ChildrenFunctionProps) => ReactNode) }> = ({
  component,
  options,
  children,
  isOpen = false,
}) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [menuElement, setMenuElement] = useState<HTMLElement | null>(null);
  const { placement = "bottom", offset = [0, 10], padding = { left: 16, right: 16 } } = options || {};

  const [isMenuOpen, setIsMenuOpen] = useState(isOpen);

  const toggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Allow for component to be controlled
  useEffect(() => {
    setIsMenuOpen(isOpen);
  }, [isOpen, setIsMenuOpen]);

  useEffect(() => {
    if (menuElement !== null && targetElement !== null) {
      const handleClickOutside = ({ target }: Event) => {
        if (target instanceof Node && !menuElement.contains(target) && !targetElement.contains(target)) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
    return undefined;
  }, [menuElement, targetElement]);

  const { styles, attributes, update } = usePopper(targetElement, menuElement, {
    placement,
    modifiers: [
      { name: "offset", options: { offset } },
      { name: "preventOverflow", options: { padding } },
    ],
  });

  const menu = (
    <div ref={setMenuElement} style={styles.popper} {...attributes.popper}>
      {typeof children === "function" ? children({ toggle, open, close, update }) : children}
    </div>
  );

  const portal = useMemo(() => getPortalRoot(), []);
  const renderMenu = portal ? createPortal(menu, portal) : menu;

  return (
    <>
      <ClickableElementContainer ref={setTargetElement} onClick={toggle}>
        {component}
      </ClickableElementContainer>
      {isMenuOpen && renderMenu}
    </>
  );
};

export default BaseMenu;
