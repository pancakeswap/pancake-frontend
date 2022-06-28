export function importAll(r: any): string[] {
  return r.keys().map(r);
}

export const bnb2CakeImages = importAll(require.context("./", false, /\.(png|jpe?g|svg)$/)).map(
  // @ts-ignore
  (d) => d.default.src
);
