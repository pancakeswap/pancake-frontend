import { MediaQueries, Breakpoints } from "../styled.d";

export const breakpoints: Breakpoints = ["370px", "512px", "755px", "968px", "1080px"];

const mediaQueries: MediaQueries = {
  xs: `@media screen and (min-width: ${breakpoints[0]})`,
  sm: `@media screen and (min-width: ${breakpoints[1]})`,
  md: `@media screen and (min-width: ${breakpoints[2]})`,
  lg: `@media screen and (min-width: ${breakpoints[3]})`,
  xl: `@media screen and (min-width: ${breakpoints[4]})`,
};

export default mediaQueries;
