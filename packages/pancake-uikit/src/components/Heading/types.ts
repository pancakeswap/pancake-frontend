export const tags = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
};

export const sizes = {
  MD: "md",
  LG: "lg",
  XL: "xl",
  XXL: "xxl",
} as const;

export type Tags = typeof tags[keyof typeof tags];
export type Sizes = typeof sizes[keyof typeof sizes];

export interface HeadingProps {
  as?: Tags;
  size?: Sizes;
}
