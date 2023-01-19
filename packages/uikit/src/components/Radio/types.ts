import { SpaceProps } from "styled-system";

export type RadioTheme = {
  handleBackground: string;
};

export const scales = {
  SM: "sm",
  MD: "md",
} as const;

export type Scales = (typeof scales)[keyof typeof scales];

export interface RadioProps extends SpaceProps {
  scale?: Scales;
}
