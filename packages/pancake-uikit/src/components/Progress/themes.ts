import { variants, scales } from "./types";

export const styleVariants = {
  [variants.ROUND]: {
    borderRadius: "32px",
  },
  [variants.FLAT]: {
    borderRadius: 0,
  },
};

export const styleScales = {
  [scales.MD]: {
    height: "16px",
  },
  [scales.SM]: {
    height: "8px",
  },
};

export default styleVariants;
