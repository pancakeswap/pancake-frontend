import "styled-components";

export type Breakpoints = string[];

export type MediaQueries = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
};

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      success: string;
      failure: string;
      contrast: string;
      input: string;
      background: string;
      text: string;
      textSubtle: string;
      card: {
        background: string;
        borderColor: string;
      };
    };
    scales: {
      breakpoints: Breakpoints;
      mediaQueries: MediaQueries;
    };
    shadows: {
      level1: string;
    };
  }
}
