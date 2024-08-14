import debounce from "lodash/debounce";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePopper } from "react-popper";
import useMatchBreakpoints from "../../contexts/MatchBreakpoints/useMatchBreakpoints";
import { useOnClickOutside } from "../../hooks";
import { MenuContext } from "../../widgets/Menu/context";
import { Box, Flex } from "../Box";
import { ChevronDownIcon, ChevronUpIcon, OpenNewIcon } from "../Svg";
import {
  DropdownMenuDivider,
  DropdownMenuItem,
  LinkStatus,
  StyledDropdownMenu,
  StyledDropdownMenuItemContainer,
} from "./styles";
import { DropdownMenuItems, DropdownMenuItemType, DropdownMenuProps } from "./types";

const MenuItem: React.FC<{
  item: DropdownMenuItems;
  activeItem?: string;
  activeSubItemChildItem?: string;
  isChildItems?: boolean;
  isDisabled?: boolean;
  linkComponent: any;
  setIsOpen: (open: boolean) => void;
}> = ({ item, isChildItems, isDisabled, linkComponent, activeItem, activeSubItemChildItem, setIsOpen }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
  const { isMobile, isMd } = useMatchBreakpoints();
  const {
    type = DropdownMenuItemType.INTERNAL_LINK,
    label,
    href = "/",
    status,
    disabled,
    items: childItemsData,
    ...itemProps
  } = item;

  const hasChildItems = useMemo(() => Boolean(childItemsData && childItemsData.length > 0), [childItemsData]);

  const isActive = useMemo(() => {
    return Boolean(
      hasChildItems
        ? item.items?.find((i) => i.href === activeSubItemChildItem)
        : isChildItems
        ? item.href === activeSubItemChildItem
        : item.href === activeItem
    );
  }, [hasChildItems, item, isChildItems, activeSubItemChildItem, activeItem]);

  const MenuItemContent = (
    <Flex alignItems="center" ml={isChildItems ? "16px" : "0px"}>
      {label}
      {status && (
        <LinkStatus textTransform="uppercase" color={status.color} fontSize="14px">
          {status.text}
        </LinkStatus>
      )}
    </Flex>
  );

  const commonProps = {
    $isActive: isActive,
    disabled: disabled || isDisabled,
    onClick: (e: any) => {
      setIsOpen(false);
      itemProps.onClick?.(e);
    },
    ...itemProps,
  };

  const handleToggleSubMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      setIsSubMenuOpen(!isSubMenuOpen);
    },
    [isSubMenuOpen]
  );

  return (
    <StyledDropdownMenuItemContainer key={label?.toString()}>
      {type === DropdownMenuItemType.BUTTON && (
        <DropdownMenuItem disabled={disabled || isDisabled} type="button" {...(commonProps as any)}>
          {MenuItemContent}
        </DropdownMenuItem>
      )}
      {type === DropdownMenuItemType.INTERNAL_LINK && (
        <DropdownMenuItem
          disabled={disabled || isDisabled}
          as={linkComponent}
          href={href}
          {...itemProps}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (hasChildItems) {
              handleToggleSubMenu(e);
            } else {
              setIsOpen(false);
              itemProps.onClick?.(e);
            }
          }}
        >
          {MenuItemContent}
          {hasChildItems && (
            <>
              {isSubMenuOpen ? (
                <ChevronDownIcon width="24px" height="24px" color="textSubtle" />
              ) : (
                <ChevronUpIcon width="24px" height="24px" color="textSubtle" />
              )}
            </>
          )}
        </DropdownMenuItem>
      )}
      {type === DropdownMenuItemType.EXTERNAL_LINK && (
        <DropdownMenuItem
          disabled={disabled || isDisabled}
          as="a"
          href={href}
          target="_blank"
          {...(commonProps as any)}
          onClick={(e: any) => {
            setIsOpen(false);
            itemProps.onClick?.(e);
          }}
        >
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {MenuItemContent}
            <OpenNewIcon color={disabled ? "textDisabled" : "textSubtle"} />
          </Flex>
        </DropdownMenuItem>
      )}

      {type === DropdownMenuItemType.DIVIDER && <DropdownMenuDivider />}

      {isSubMenuOpen &&
        hasChildItems &&
        childItemsData
          ?.filter((childItem) => ((isMobile || isMd) && childItem.isMobileOnly) || !childItem.isMobileOnly)
          ?.map((childItem) => (
            <MenuItem
              isChildItems
              key={childItem?.label?.toString()}
              item={childItem}
              isDisabled={isDisabled}
              linkComponent={linkComponent}
              activeSubItemChildItem={activeSubItemChildItem}
              setIsOpen={setIsOpen}
            />
          ))}
    </StyledDropdownMenuItemContainer>
  );
};

const DropdownMenu: React.FC<React.PropsWithChildren<DropdownMenuProps>> = ({
  children,
  isBottomNav = false,
  showItemsOnMobile = false,
  activeItem = "",
  activeSubItemChildItem = "",
  items = [],
  index,
  setMenuOpenByIndex,
  isDisabled,
  ...props
}) => {
  const { linkComponent } = useContext(MenuContext);
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile, isMd } = useMatchBreakpoints();
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
          ref={setTooltipRef}
          style={styles.popper}
          $isBottomNav={isBottomNav}
          $isOpen={isMenuShow}
          {...attributes.popper}
        >
          {items
            .filter((item) => ((isMobile || isMd) && item.isMobileOnly) || !item.isMobileOnly)
            .map((item) => (
              <MenuItem
                key={item?.label?.toString()}
                item={item}
                activeItem={activeItem}
                activeSubItemChildItem={activeSubItemChildItem}
                isDisabled={isDisabled}
                linkComponent={linkComponent}
                setIsOpen={setIsOpen}
              />
            ))}
        </StyledDropdownMenu>
      )}
    </Box>
  );
};

export default DropdownMenu;
