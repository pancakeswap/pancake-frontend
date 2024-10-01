/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType, MouseEventHandler } from "react";
import { BoxProps } from "../Box";
import { DropdownMenuItems } from "../DropdownMenu/types";

export type MenuItemsType = {
  label: string;
  href: string;
  icon?: ElementType<any>;
  fillIcon?: ElementType<any>;
  items?: DropdownMenuItems[];
  disabled?: boolean;
  showOnMobile?: boolean;
  showItemsOnMobile?: boolean;
  onClick?: MouseEventHandler;
};

export interface MenuItemsProps extends BoxProps {
  items: MenuItemsType[];
  activeItem?: string;
  activeSubItem?: string;
  activeSubItemChildItem?: string;
}
