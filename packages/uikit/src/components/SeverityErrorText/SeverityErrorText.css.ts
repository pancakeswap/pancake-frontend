import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { atoms } from "../../css/atoms";

export const severityVariants = recipe({
  variants: {
    severity: {
      0: atoms({
        color: "success",
      }),
      1: atoms({
        color: "text",
      }),
      2: atoms({
        color: "warning",
      }),
      3: atoms({
        color: "failure",
      }),
      4: atoms({
        color: "failure",
      }),
    },
  },
});

export type SeverityVariants = RecipeVariants<typeof severityVariants>;
