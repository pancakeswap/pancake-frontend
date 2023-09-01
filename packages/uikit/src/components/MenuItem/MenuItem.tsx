import React, { useContext, useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MenuContext } from "../../widgets/Menu/context";
import StyledMenuItem, { StyledMenuItemContainer } from "./styles";
import { MenuItemProps } from "./types";
import { useMatchBreakpoints } from "../../contexts";

const MenuItem: React.FC<React.PropsWithChildren<MenuItemProps>> = ({
  children,
  href,
  isDisabled = false,
  variant = "default",
  scrollLayerRef,
  statusColor,
  ...props
}) => {
  const { isMobile } = useMatchBreakpoints();
  const menuItemRef = useRef<HTMLDivElement>(null);
  const { linkComponent } = useContext(MenuContext);
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  const itemLinkProps: any = href
    ? {
        as: linkComponent,
        href,
      }
    : {
        as: "div",
      };

  useEffect(() => {
    setIsActive(router.pathname === href); // Compare current URL with href prop

    if (!isMobile || !isActive || !menuItemRef.current || !scrollLayerRef?.current) return;
    const scrollLayer = scrollLayerRef.current;
    const menuNode = menuItemRef.current.parentNode as HTMLDivElement;
    if (!menuNode) return;
    if (
      scrollLayer.scrollLeft > menuNode.offsetLeft ||
      scrollLayer.scrollLeft + scrollLayer.offsetWidth < menuNode.offsetLeft + menuNode.offsetWidth
    ) {
      scrollLayer.scrollLeft = menuNode.offsetLeft;
    }
  }, [isActive, isMobile, scrollLayerRef, router.pathname, href]);

  return (
    <StyledMenuItemContainer $isActive={isActive} $variant={variant} ref={menuItemRef}>
      <StyledMenuItem
        {...itemLinkProps}
        $isActive={isActive}
        $isDisabled={isDisabled}
        $variant={variant}
        $statusColor={statusColor}
        {...props}
      >
        {children}
      </StyledMenuItem>
    </StyledMenuItemContainer>
  );
};

export default MenuItem;
