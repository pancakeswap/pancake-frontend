import { variants } from "./types";

export const styleVariants = {
  [variants.ROUND]: {
    borderRadius: "32px",
  },
  [variants.FLAT]: {
    borderRadius: 0,
  },
};

export default styleVariants;
