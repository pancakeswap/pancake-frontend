import React from "react";
import { SpaceProps } from "styled-system";

export interface BreadcrumbsProps extends SpaceProps {
  separator?: React.ReactNode;
  children?: React.ReactNode;
}
