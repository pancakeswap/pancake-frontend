import "styled-components";

export type Pallete = {
  iris: string;
  peach: string;
  onyx: string;
  fuschia: string;
  evergreen: string;
  slate: string;
  lightSlate: string;
  dorian: string;
  cloud: string;
  white: string;
};

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      background: string;
      text: string;
      textSubtle: string;
      dark: string;
      failure: string;
      success: string;
      accent: string;
      light: string;
    } & Pallete;
  }
}
