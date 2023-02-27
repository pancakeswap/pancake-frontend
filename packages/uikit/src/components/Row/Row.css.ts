import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const rowVariants = recipe({
  base: {
    display: "flex",
  },
  variants: {
    gap: {
      sm: {
        rowGap: "8px",
      },
      md: {
        rowGap: "12px",
      },
      lg: {
        rowGap: "24px",
      },
    },
  },
});

export type Variants = RecipeVariants<typeof rowVariants>;
