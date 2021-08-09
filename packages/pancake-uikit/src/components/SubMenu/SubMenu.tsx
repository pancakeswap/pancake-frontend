import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { Placement, Padding } from "@popperjs/core";
import { SubMenuContainer, ClickableElementContainer } from "./styles";

export interface SubMenuProps {
  component: React.ReactNode;
  options?: {
    placement?: Placement;
    offset?: [number, number];
    padding?: Padding;
  };
}

const portalRoot = document.getElementById("portal-root");

const SubMenu: React.FC<SubMenuProps> = ({ component, options, children }) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [menuElement, setMenuElement] = useState<HTMLElement | null>(null);
  const placement = options?.placement ?? "bottom";
  const offset = options?.offset ?? [0, 10];
  const padding = options?.padding ?? { left: 16, right: 16 };

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = ({ target }: Event) => {
      if (target instanceof Node) {
        if (
          menuElement !== null &&
          targetElement !== null &&
          !menuElement.contains(target) &&
          !targetElement.contains(target)
        ) {
          setIsOpen(false);
        }
      }
    };
    if (menuElement !== null) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuElement, targetElement]);

  const { styles, attributes } = usePopper(targetElement, menuElement, {
    placement,
    modifiers: [
      { name: "offset", options: { offset } },
      { name: "preventOverflow", options: { padding } },
    ],
  });

  const menu = (
    <SubMenuContainer ref={setMenuElement} style={styles.popper} {...attributes.popper}>
      {children}
    </SubMenuContainer>
  );

  const renderMenu = portalRoot ? createPortal(menu, portalRoot) : menu;

  return (
    <>
      <ClickableElementContainer ref={setTargetElement} onClick={toggle}>
        {component}
      </ClickableElementContainer>
      {isOpen && renderMenu}
    </>
  );
};

export default SubMenu;
