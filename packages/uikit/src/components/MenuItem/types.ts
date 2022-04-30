import { Colors } from "../../theme";

export type MenuItemVariant = "default" | "subMenu";

export interface MenuItemProps {
  isActive?: boolean;
  href?: string;
  variant?: MenuItemVariant;
  statusColor?: keyof Colors;
  children?: React.ReactNode;
}

export type StyledMenuItemProps = {
  $isActive?: boolean;
  $variant?: MenuItemVariant;
  $statusColor?: keyof Colors;
};
