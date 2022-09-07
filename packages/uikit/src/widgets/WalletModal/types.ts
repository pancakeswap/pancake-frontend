import { FC } from "react";
import { SvgProps } from "../../components/Svg/types";

export type Login<T> = (connectorId: T) => void;

// eslint-disable-next-line @typescript-eslint/ban-types
export interface WalletConfig<T = {}> {
  title: string;
  icon: FC<React.PropsWithChildren<SvgProps>>;
  connectorId: T;
  priority: number | (() => number);
  href?: string;
  installed?: boolean;
  downloadLink?: {
    desktop?: string;
    mobile?: string;
  };
}
