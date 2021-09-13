import { BoxProps } from "../Box";

export type SubMenuItemsType = {
  label: string;
  href: string;
};

export interface SubMenuItemsProps extends BoxProps {
  items: SubMenuItemsType[];
  activeItem?: string;
}
