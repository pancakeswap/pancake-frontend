import React from "react";
import { Box } from "../Box";
import MenuItem from "../MenuItem/MenuItem";
import StyledSubMenuItems from "./styles";
import { SubMenuItemsProps } from "./types";

const SubMenuItems: React.FC<SubMenuItemsProps> = ({ items = [], activeItem, ...props }) => {
  return (
    <StyledSubMenuItems justifyContent={["start", null, "center"]} {...props} pl={["12px", null, "0px"]}>
      {items.map(
        ({ label, href }) =>
          label && (
            <Box key={label} mr="20px">
              <MenuItem href={href} isActive={href === activeItem} variant="subMenu">
                {label}
              </MenuItem>
            </Box>
          )
      )}
    </StyledSubMenuItems>
  );
};

export default SubMenuItems;
