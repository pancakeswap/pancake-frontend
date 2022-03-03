/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType } from "react";
import { FlexProps } from "../Box";

export type SubMenuItemsType = {
  label: string;
  href: string;
  itemProps?: any;
  icon?: ElementType<any>;
  isMobileOnly?: boolean;
};

export interface SubMenuItemsProps extends FlexProps {
  items: SubMenuItemsType[];
  activeItem?: string;
  isMobileOnly?: boolean;
}
