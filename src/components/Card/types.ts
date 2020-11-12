import { Colors } from "../../theme/types";

export interface CardRibbonProps {
  variantColor?: keyof Colors;
  text: string;
}

export type CardTheme = {
  background: string;
  boxShadow: string;
  boxShadowActive: string;
  boxShadowSuccess: string;
  boxShadowWarning: string;
};

export interface CardProps {
  isActive?: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  ribbon?: React.ReactNode;
}
