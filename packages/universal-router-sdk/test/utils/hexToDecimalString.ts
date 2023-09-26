export function hexToDecimalString(hex: string): string {
  const decimalBigInt = BigInt(`0x${hex}`);
  return decimalBigInt.toString();
}
