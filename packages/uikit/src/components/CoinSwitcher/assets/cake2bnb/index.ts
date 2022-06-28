export function importAll(r: any): string[] {
  return r.keys().map(r);
}

export const cake2BnbImages = importAll(require.context("./", false, /\.(png|jpe?g|svg)$/)).map(
  // @ts-ignore
  (d) => d.default.src
);
