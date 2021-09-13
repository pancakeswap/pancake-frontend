import { BoxProps } from "../Box";
import { MenuItemsType } from "../MenuItems/types";

export interface BottomNavProps extends BoxProps {
  items: MenuItemsType[];
  activeItem?: string;
  activeSubItem?: string;
}
