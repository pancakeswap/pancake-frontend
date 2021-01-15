import { SpaceProps } from "styled-system";

export interface ContainerProps {
  width: number;
  height: number;
  responsive?: boolean;
}

export interface ImageProps extends ContainerProps, SpaceProps {
  src: string;
  alt?: string;
}
