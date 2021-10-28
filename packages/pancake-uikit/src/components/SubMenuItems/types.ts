import { FlexProps } from "../Box";

export type SubMenuItemsType = {
  label: string;
  href: string;
  iconName?: string;
  isMobileOnly?: boolean;
};

export interface SubMenuItemsProps extends FlexProps {
  items: SubMenuItemsType[];
  activeItem?: string;
  isMobileOnly?: boolean;
}
