import React, { useLayoutEffect, useRef, useCallback } from "react";
import { Box } from "../Box";
import { DropdownMenuItemType } from "../DropdownMenu/types";
import MenuItem from "../MenuItem/MenuItem";
import { OpenNewIcon, ChevronRightIcon, ChevronLeftIcon } from "../Svg";
import StyledSubMenuItems, {
  StyledSubMenuItemWrapper,
  LeftMaskLayer,
  RightMaskLayer,
  SubMenuItemWrapper,
} from "./styles";
import { SubMenuItemsProps } from "./types";
import useMatchBreakpointsContext from "../../contexts/MatchBreakpoints/useMatchBreakpointsContext";

const SUBMENU_CHEVRON_CLICK_MOVE_PX = 100;

const SubMenuItems: React.FC<SubMenuItemsProps> = ({ items = [], activeItem, isMobileOnly = false, ...props }) => {
  const { isMobile } = useMatchBreakpointsContext();
  const scrollLayerRef = useRef<HTMLDivElement>(null);
  const chevronLeftRef = useRef<HTMLDivElement>(null);
  const chevronRightRef = useRef<HTMLDivElement>(null);
  const layerController = useCallback(() => {
    if (!scrollLayerRef.current || !chevronLeftRef.current || !chevronRightRef.current) return;
    const scrollLayer = scrollLayerRef.current;
    if (scrollLayer.scrollLeft === 0) chevronLeftRef.current.classList.add("hide");
    else chevronLeftRef.current.classList.remove("hide");
    if (scrollLayer.scrollLeft + scrollLayer.offsetWidth < scrollLayer.scrollWidth)
      chevronRightRef.current.classList.remove("hide");
    else chevronRightRef.current.classList.add("hide");
  }, []);
  useLayoutEffect(() => {
    layerController();
  }, [layerController]);
  return (
    <SubMenuItemWrapper $isMobileOnly={isMobileOnly} {...props}>
      {isMobile && (
        <LeftMaskLayer
          ref={chevronLeftRef}
          onClick={() => {
            if (!scrollLayerRef.current) return;
            scrollLayerRef.current.scrollLeft -= SUBMENU_CHEVRON_CLICK_MOVE_PX;
          }}
        >
          <ChevronLeftIcon />
        </LeftMaskLayer>
      )}
      {isMobile && (
        <RightMaskLayer
          ref={chevronRightRef}
          onClick={() => {
            if (!scrollLayerRef.current) return;
            scrollLayerRef.current.scrollLeft += SUBMENU_CHEVRON_CLICK_MOVE_PX;
          }}
        >
          <ChevronRightIcon />
        </RightMaskLayer>
      )}
      <StyledSubMenuItems
        justifyContent={[isMobileOnly ? "flex-end" : "start", null, "center"]}
        pl={["12px", null, "0px"]}
        onScroll={layerController}
        ref={scrollLayerRef}
      >
        {items.map(({ label, href, icon, itemProps, type }) => {
          const Icon = icon;
          const isExternalLink = type === DropdownMenuItemType.EXTERNAL_LINK;
          const linkProps = isExternalLink
            ? {
                as: "a",
                target: "_blank",
              }
            : {};

          return (
            label && (
              <StyledSubMenuItemWrapper key={label} mr="20px">
                <MenuItem href={href} isActive={href === activeItem} variant="subMenu" {...itemProps} {...linkProps}>
                  {Icon && <Icon color={href === activeItem ? "secondary" : "textSubtle"} mr="4px" />}
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
