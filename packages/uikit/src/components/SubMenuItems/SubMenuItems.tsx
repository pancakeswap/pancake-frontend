import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "../Box";
import { DropdownMenuItemType } from "../DropdownMenu/types";
import MenuItem from "../MenuItem/MenuItem";
import { ChevronLeftIcon, ChevronRightIcon, OpenNewIcon } from "../Svg";
import StyledSubMenuItems, {
  LeftMaskLayer,
  RightMaskLayer,
  StyledSubMenuItemWrapper,
  SubMenuItemWrapper,
} from "./styles";
import { SubMenuItemsProps } from "./types";

const SUBMENU_CHEVRON_CLICK_MOVE_PX = 100;
const SUBMENU_SCROLL_DEVIATION = 3;

const SubMenuItems: React.FC<React.PropsWithChildren<SubMenuItemsProps>> = ({
  items = [],
  activeItem,
  isMobileOnly = false,
  ...props
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const scrollLayerRef = useRef<HTMLDivElement>(null);
  const chevronLeftRef = useRef<HTMLDivElement>(null);
  const chevronRightRef = useRef<HTMLDivElement>(null);

  const layerController = useCallback(() => {
    if (!scrollLayerRef.current || !chevronLeftRef.current || !chevronRightRef.current) return;
    const scrollLayer = scrollLayerRef.current;
    if (scrollLayer.scrollLeft === 0) chevronLeftRef.current.classList.add("hide");
    else chevronLeftRef.current.classList.remove("hide");
    if (scrollLayer.scrollLeft + scrollLayer.offsetWidth < scrollLayer.scrollWidth - SUBMENU_SCROLL_DEVIATION)
      chevronRightRef.current.classList.remove("hide");
    else chevronRightRef.current.classList.add("hide");
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      layerController();
    }
  }, [layerController, isMounted]);

  return (
    <SubMenuItemWrapper $isMobileOnly={isMobileOnly} {...props}>
      {isMounted && (
        <Box
          as={LeftMaskLayer}
          display={["block", "block", "none"]}
          ref={chevronLeftRef}
          onClick={() => {
            if (!scrollLayerRef.current) return;
            scrollLayerRef.current.scrollLeft -= SUBMENU_CHEVRON_CLICK_MOVE_PX;
          }}
        >
          <ChevronLeftIcon />
        </Box>
      )}
      {isMounted && (
        <Box
          as={RightMaskLayer}
          display={["block", "block", "none"]}
          ref={chevronRightRef}
          onClick={() => {
            if (!scrollLayerRef.current) return;
            scrollLayerRef.current.scrollLeft += SUBMENU_CHEVRON_CLICK_MOVE_PX;
          }}
        >
          <ChevronRightIcon />
        </Box>
      )}
      <StyledSubMenuItems
        justifyContent={[isMobileOnly ? "flex-end" : "start", null, "center"]}
        pl={["12px", null, "0px"]}
        onScroll={debounce(layerController, 100)}
        ref={scrollLayerRef}
      >
        {items.map(({ label, href, icon, itemProps, type, disabled }) => {
          const Icon = icon;
          const isExternalLink = type === DropdownMenuItemType.EXTERNAL_LINK;
          const linkProps = isExternalLink
            ? {
                as: "a",
                target: "_blank",
              }
            : {};

          const isActive = href === activeItem;

          return (
            label && (
              <StyledSubMenuItemWrapper key={label} mr="20px">
                <MenuItem
                  href={href}
                  scrollLayerRef={scrollLayerRef}
                  isActive={isActive}
                  isDisabled={disabled}
                  variant="subMenu"
                  {...itemProps}
                  {...linkProps}
                >
                  {Icon && <Icon color={isActive ? "secondary" : "textSubtle"} mr="4px" />}
                  {label}
                  {isExternalLink && (
                    <Box display={["none", null, "flex"]} style={{ alignItems: "center" }} ml="4px">
                      <OpenNewIcon color="textSubtle" />
                    </Box>
                  )}
                </MenuItem>
              </StyledSubMenuItemWrapper>
            )
          );
        })}
      </StyledSubMenuItems>
    </SubMenuItemWrapper>
  );
};

export default SubMenuItems;
