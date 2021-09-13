import React from "react";
import { Flex } from "../Box";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import MenuItem from "../MenuItem/MenuItem";
import IconComponent from "../Svg/IconComponent";
import { MenuItemsProps } from "./types";

const MenuItems: React.FC<MenuItemsProps> = ({ items = [], activeItem, activeSubItem, ...props }) => {
  return (
    <Flex {...props}>
      {items.map(({ label, items: menuItems = [], href, icon = "" }) => {
        const statusColor = menuItems?.find((menuItem) => menuItem.status !== undefined)?.status?.color;
        const isActive = activeItem === href;
        return (
          <DropdownMenu key={label} items={menuItems} py={1} activeItem={activeSubItem}>
            <MenuItem href={href} isActive={isActive} statusColor={statusColor}>
              {label || <IconComponent iconName={icon} color={isActive ? "secondary" : "textSubtle"} />}
            </MenuItem>
          </DropdownMenu>
        );
      })}
    </Flex>
  );
};

export default MenuItems;
