import React from "react";
import { Box } from "../Box";
import { DropdownMenuItemType } from "../DropdownMenu/types";
import MenuItem from "../MenuItem/MenuItem";
import { OpenNewIcon } from "../Svg";
import StyledSubMenuItems from "./styles";
import { SubMenuItemsProps } from "./types";

const SubMenuItems: React.FC<SubMenuItemsProps> = ({ items = [], activeItem, isMobileOnly = false, ...props }) => {
  return (
    <StyledSubMenuItems
      justifyContent={[isMobileOnly ? "flex-end" : "start", null, "center"]}
      {...props}
      pl={["12px", null, "0px"]}
      $isMobileOnly={isMobileOnly}
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
            <Box key={label} mr="20px">
              <MenuItem href={href} isActive={href === activeItem} variant="subMenu" {...itemProps} {...linkProps}>
                {Icon && <Icon color={href === activeItem ? "secondary" : "textSubtle"} mr="4px" />}
                {label}
                {isExternalLink && (
                  <Box display={["none", null, "flex"]} style={{ alignItems: "center" }} ml="4px">
                    <OpenNewIcon color="textSubtle" />
                  </Box>
                )}
              </MenuItem>
            </Box>
          )
        );
      })}
    </StyledSubMenuItems>
  );
};

export default SubMenuItems;
