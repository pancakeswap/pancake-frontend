import { breakpoints, mediaQueries, vars } from "@pancakeswap/ui";

export default {
  siteWidth: 1200,
  breakpoints: Object.values(breakpoints).map((bp) => `${bp}px`),
  mediaQueries,
  spacing: vars.space,
  shadows: vars.shadows,
  radii: vars.radii,
  zIndices: { ribbon: 9, dropdown: 10, modal: 100 },
};
