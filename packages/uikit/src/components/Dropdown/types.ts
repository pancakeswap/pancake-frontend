import React from "react";

export type Position = "top" | "top-right" | "bottom";

export interface PositionProps {
  position?: Position;
}

export interface DropdownProps extends PositionProps {
  target: React.ReactElement;
  children?: React.ReactNode;
}
