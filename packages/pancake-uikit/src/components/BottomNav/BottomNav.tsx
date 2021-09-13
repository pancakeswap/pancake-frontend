import React from "react";
import BottomNavItem from "../BottomNavItem";
import StyledBottomNav from "./styles";
import { Box } from "../Box";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { BottomNavProps } from "./types";

const BottomNav: React.FC<BottomNavProps> = ({ items = [], activeItem = "", activeSubItem = "", ...props }) => {
  return (
    <StyledBottomNav justifyContent="space-around" {...props}>
      {items.map(({ label, items: menuItems, href, icon, showOnMobile = true, showItemsOnMobile = true }) => {
        return (
          showOnMobile && (
            <DropdownMenu
              key={label}
              items={menuItems}
              isBottomNav
              activeItem={activeSubItem}
              showItemsOnMobile={showItemsOnMobile}
            >
              <Box>
                <BottomNavItem
                  href={href}
                  isActive={href === activeItem}
                  label={label}
                  iconName={icon}
                  showItemsOnMobile={showItemsOnMobile}
                />
              </Box>
            </DropdownMenu>
          )
        );
      })}
    </StyledBottomNav>
  );
};

export default BottomNav;
