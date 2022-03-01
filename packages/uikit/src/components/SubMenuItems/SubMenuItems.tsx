import React from "react";
import { Box } from "../Box";
import MenuItem from "../MenuItem/MenuItem";
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
      {items.map(({ label, href, icon, itemProps }) => {
        const Icon = icon;
        return (
          label && (
            <Box key={label} mr="20px">
              <MenuItem href={href} isActive={href === activeItem} variant="subMenu" {...itemProps}>
                {Icon && <Icon color={href === activeItem ? "secondary" : "textSubtle"} mr="4px" />}
                {label}
              </MenuItem>
            </Box>
          )
        );
      })}
    </StyledSubMenuItems>
  );
};

export default SubMenuItems;
