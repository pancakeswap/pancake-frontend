import { ReactNode } from "react";
import { Placement, Padding } from "@popperjs/core";

export interface MenuOptions {
  placement?: Placement;
  offset?: [number, number];
  padding?: Padding;
}

export interface BaseMenuProps {
  component: ReactNode;
  options?: MenuOptions;
  isOpen?: boolean;
}
