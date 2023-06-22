import { AtomBox } from "@pancakeswap/ui/components/AtomBox";
import { useIsomorphicLayoutEffect } from "framer-motion";
import debounce from "lodash/debounce";
import React, { useCallback, useRef } from "react";
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
  const scrollLayerRef = useRef<HTMLDivElement>(null);
  const chevronLeftRef = useRef<HTMLDivElement>(null);
  const chevronRightRef = useRef<HTMLDivElement>(null);
  const layerController = useCallback(() => {
    if (!scrollLayerRef.current || !chevronLeftRef.current || !chevronRightRef.current) return;
    const scrollLayer = scrollLayerRef.current;
    if (scrollLayer.scrollLeft !== 0) chevronLeftRef.current.classList.add("show");
    else chevronLeftRef.current.classList.remove("show");
    if (scrollLayer.scrollLeft + scrollLayer.offsetWidth < scrollLayer.scrollWidth - SUBMENU_SCROLL_DEVIATION)
      chevronRightRef.current.classList.add("show");
    else chevronRightRef.current.classList.remove("show");
  }, []);

  useIsomorphicLayoutEffect(() => {
    layerController();
  }, [layerController]);

  return (
    <AtomBox display={{ xs: "none", sm: "block" }} asChild>
      <SubMenuItemWrapper $isMobileOnly={isMobileOnly} {...props}>
        <AtomBox display={{ xs: "block", md: "none" }} asChild>
          <LeftMaskLayer
            ref={chevronLeftRef}
            onClick={() => {
              if (!scrollLayerRef.current) return;
              scrollLayerRef.current.scrollLeft -= SUBMENU_CHEVRON_CLICK_MOVE_PX;
            }}
          >
            <ChevronLeftIcon />
          </LeftMaskLayer>
        </AtomBox>
        <AtomBox display={{ xs: "block", md: "none" }} asChild>
          <RightMaskLayer
            ref={chevronRightRef}
            onClick={() => {
              if (!scrollLayerRef.current) return;
              scrollLayerRef.current.scrollLeft += SUBMENU_CHEVRON_CLICK_MOVE_PX;
            }}
          >
            <ChevronRightIcon />
          </RightMaskLayer>
        </AtomBox>
        <StyledSubMenuItems
          justifyContent={[isMobileOnly ? "flex-end" : "start", null, "center"]}
          pl={["12px", null, "0px"]}
          onScroll={debounce(layerController, 100)}
          ref={scrollLayerRef}
        >
          {items.map(({ label, href, icon, itemProps, type, disabled, onClick }) => {
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
                    onClick={onClick}
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
    </AtomBox>
  );
};

export default SubMenuItems;
