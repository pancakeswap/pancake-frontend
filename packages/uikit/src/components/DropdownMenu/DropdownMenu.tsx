/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useState, useCallback } from "react";
import { usePopper } from "react-popper";
import debounce from "lodash/debounce";
import { useOnClickOutside } from "../../hooks";
import { MenuContext } from "../../widgets/Menu/context";
import { Box, Flex } from "../Box";
import { LogoutIcon } from "../Svg";
import {
  DropdownMenuDivider,
  DropdownMenuItem,
  StyledDropdownMenu,
  LinkStatus,
  StyledDropdownMenuItemContainer,
} from "./styles";
import { DropdownMenuItemType, DropdownMenuProps } from "./types";

const DropdownMenu: React.FC<React.PropsWithChildren<DropdownMenuProps>> = ({
  children,
  isBottomNav = false,
  showItemsOnMobile = false,
  activeItem = "",
  items = [],
  index,
  setMenuOpenByIndex,
  isDisabled,
  ...props
}) => {
  const { linkComponent } = useContext(MenuContext);
  const [isOpen, setIsOpen] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);
  const hasItems = items.length > 0;
  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: isBottomNav ? "absolute" : "fixed",
    placement: isBottomNav ? "top" : "bottom-start",
    modifiers: [{ name: "offset", options: { offset: [0, isBottomNav ? 6 : 0] } }],
  });

  const isMenuShow = isOpen && ((isBottomNav && showItemsOnMobile) || !isBottomNav);

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true);
      hideDropdownMenu.cancel();
    };

    const hideDropdownMenu = debounce(
      () => {
        setIsOpen(false);
      },
      isBottomNav ? 100 : 10
    );

    // added this to remove the ugly 4 lines
    [targetRef, tooltipRef].forEach((ref) => {
      ref?.addEventListener("mouseenter", showDropdownMenu);
      ref?.addEventListener("mouseleave", hideDropdownMenu);
    });

    return () => {
      [targetRef, tooltipRef].forEach((ref) => {
        ref?.removeEventListener("mouseenter", showDropdownMenu);
        ref?.removeEventListener("mouseleave", hideDropdownMenu);
      });
      hideDropdownMenu.cancel();
    };
  }, [setIsOpen, tooltipRef, targetRef, isBottomNav]);

  useEffect(() => {
    if (setMenuOpenByIndex && index !== undefined) {
      setMenuOpenByIndex((prevValue) => ({ ...prevValue, [index]: isMenuShow }));
    }
  }, [isMenuShow, setMenuOpenByIndex, index]);

  useOnClickOutside(
    targetRef,
    useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen])
  );

  return (
    <Box ref={setTargetRef} {...props}>
      <Box
        onPointerDown={() => {
          setIsOpen((s) => !s);
        }}
      >
        {children}
      </Box>
      {hasItems && (
        <StyledDropdownMenu
          style={styles.popper}
          ref={setTooltipRef}
          {...attributes.popper}
          $isBottomNav={isBottomNav}
          $isOpen={isMenuShow}
        >
          {items
            .filter((item) => !item.isMobileOnly)
            .map(
              (
                { type = DropdownMenuItemType.INTERNAL_LINK, label, href = "/", status, disabled, ...itemProps },
                itemItem
              ) => {
                const MenuItemContent = (
                  <>
                    {label}
                    {status && (
                      <LinkStatus textTransform="uppercase" color={status.color} fontSize="14px">
                        {status.text}
                      </LinkStatus>
                    )}
                  </>
                );
                const isActive = href === activeItem;
                return (
                  <StyledDropdownMenuItemContainer key={itemItem}>
                    {type === DropdownMenuItemType.BUTTON && (
                      <DropdownMenuItem
                        $isActive={isActive}
                        disabled={disabled || isDisabled}
                        type="button"
                        {...itemProps}
                      >
                        {MenuItemContent}
                      </DropdownMenuItem>
                    )}
                    {type === DropdownMenuItemType.INTERNAL_LINK && (
                      <DropdownMenuItem
                        $isActive={isActive}
                        disabled={disabled || isDisabled}
                        as={linkComponent}
                        href={href}
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        {...itemProps}
                      >
                        {MenuItemContent}
                      </DropdownMenuItem>
                    )}
                    {type === DropdownMenuItemType.EXTERNAL_LINK && (
                      <DropdownMenuItem
                        $isActive={isActive}
                        disabled={disabled || isDisabled}
                        as="a"
                        href={href}
                        target="_blank"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        {...itemProps}
                      >
                        <Flex alignItems="center" justifyContent="space-between" width="100%">
                          {label}
                          <LogoutIcon color={disabled ? "textDisabled" : "textSubtle"} />
                        </Flex>
                      </DropdownMenuItem>
                    )}
                    {type === DropdownMenuItemType.DIVIDER && <DropdownMenuDivider />}
                  </StyledDropdownMenuItemContainer>
                );
              }
            )}
        </StyledDropdownMenu>
      )}
    </Box>
  );
};

export default DropdownMenu;
